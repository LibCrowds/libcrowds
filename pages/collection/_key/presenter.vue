<template>
  <div id="presenter">
    <component
      :is="presenter"
      v-if="project && tasks.length"
      :project="project"
      :tasks="tasks"
      :collection-config="collectionConfig"
      @submit="onSubmit"
      @taskliked="onTaskLiked">
    </component>
  </div>
</template>

<script>
import { notifications } from '@/mixins/notifications'
import pybossa from '@/api/pybossa'
import isEmpty from 'lodash/isEmpty'
import LibcrowdsViewerPresenter from '@/components/presenters/LibcrowdsViewer'
import Z3950Presenter from '@/components/presenters/Z3950'
import DefaultPresenter from '@/components/presenters/Default'

export default {
  layout: 'tabs',

  data () {
    return {
      tasks: [],
      navItems: [
        {
          id: 'back-to-contribute',
          text: 'Back',
          route: {
            name: 'collection-contribute',
            params: {
              collectionname: this.collectionConfig.key
            }
          }
        }
      ]
    }
  },

  async asyncData ({ params }) {
    const res = await pybossa.getProject(params.shortname)
    return {
      project: res.data.project
    }
  },

  head () {
    return {
      title: this.project.name,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.project.description
        }
      ]
    }
  },

  props: {
    collectionConfig: {
      type: Object,
      required: true
    }
  },

  computed: {
    presenter () {
      const presenters = {
        'libcrowds-viewer': LibcrowdsViewerPresenter,
        'z3950': Z3950Presenter,
        default: DefaultPresenter
      }
      return this.collectionConfig.presenter
        ? presenters[this.collectionConfig.presenter]
        : presenters.default
    }
  },

  methods: {
    /**
     * Return the URL to load the next set of tasks
     */
    getLoadTasksUrl () {
      const endpoint = `/api/project/${this.project.id}/newtask`
      let q = 'limit=10'
      if (this.tasks.length) {
        const lastTask = this.tasks[this.tasks.length - 1]
        q += `&last_id=${lastTask.id}`
      }
      return `${endpoint}?${q}`
    },

    /**
     * Load the next set of tasks.
     */
    loadTasks () {
      const url = this.getLoadTasksUrl()
      pybossa.client.get(url).then(r => {
        if (isEmpty(r.data)) {
          this.handleCompletion()
        } else {
          const loadedTasks = Array.isArray(r.data) ? r.data : [r.data]
          this.tasks = this.tasks.concat(loadedTasks)
        }
      })
    },

    /**
     * Handle no tasks remaining.
     */
    handleCompletion () {
      const projectComplete = this.project.overall_progress === 100
      let html = `You have contributed to all available tasks for ` +
                 `<em>${this.project.name}</em>`
      if (projectComplete) {
        html = `<em>${this.project.name}</em> is now complete`
      }
      this.$swal({
        title: 'Thank you!',
        html: html,
        type: 'success'
      })
      this.$router.push({
        name: 'collection-contribute',
        params: {
          collectionname: this.collectionConfig.key
        }
      })
    },

    /**
     * Handle the task liked event.
     * @param {String|Number} id
     *   The task ID.
     * @param {Boolean} liked
     *   True for task liked, false otherwise.
     */
    onTaskLiked (taskId, liked) {
      if (liked) {
        pybossa.create('favorite', {
          task_id: taskId
        }).then(() => {
          this.notify({
            title: 'Success',
            text: 'Removed from favourites',
            type: 'success'
          })
        })
      } else {
        pybossa.delete('favorite', taskId).then(() => {
          this.notify({
            title: 'Success',
            text: 'Added to favourites',
            type: 'success'
          })
        })
      }
    },

    /**
     * Remove a task from the queue by ID.
     * @param {String|Number} taskId
     *   The task ID.
     */
    removeTask (taskId) {
      const idx = this.tasks.map((task) => { return task.id }).indexOf(taskId)
      if (idx > -1) {
        this.tasks.splice(idx, 1)
      }
    },

    /**
     * Handle the submit event.
     * @param {String|Number} projectId
     *   The project ID.
     * @param {String|Number} taskId
     *   The task ID.
     * @param {Object} answer
     *   The answer data.
     */
    onSubmit (projectId, taskId, answer) {
      const cookieName = `${this.project.short_name}_participated`
      const hasParticipated = this.$cookie.get(cookieName)
      const taskrun = JSON.stringify({
        'project_id': projectId,
        'task_id': taskId,
        'info': answer
      })
      pybossa.client.post(`/api/taskrun`, taskrun).then(r => {
        this.removeTask(taskId)
        this.loadTasks()
        if (hasParticipated === 'true') {
          this.notify({
            title: 'Answer saved',
            text: 'Thank you for your contribution!',
            type: 'success'
          })
        } else {
          this.$swal({
            title: 'Thank you!',
            html: 'Your contribution has been saved successfully and will ' +
                  'directly help enable future research.',
            type: 'success'
          })
        }
        this.$cookie.set(cookieName, true, { expires: '1Y' })
      })
    }
  },

  created () {
    this.$emit('navupdated', this.navItems)
    this.loadTasks()
  },

  mixins: [ notifications ]
}
</script>
