<template>
  <div id="presenter">
    <p class="lead text-center" v-if="!presenter">
      No task presenter has been configured for this collection.
    </p>
    <component
      v-else-if="project"
      :is="presenter"
      :project="project"
      :tasks="tasks"
      @submit="onSubmit"
      @taskliked="onTaskLiked">
    </component>
  </div>
</template>

<script>
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { notifications } from '@/mixins/notifications'
import isEmpty from 'lodash/isEmpty'
import LibcrowdsViewerPresenter from '@/components/presenters/LibcrowdsViewer'
import Z3950Presenter from '@/components/presenters/Z3950'

export default {
  layout: 'collection-tabs',

  mixins: [ notifications, fetchCollectionByName ],

  data () {
    return {
      tasks: []
    }
  },

  async asyncData ({ params, app, error }) {
    const endpoint = `/api/project/${params.id}`
    return app.$axios.$get(endpoint).then(data => {
      return {
        project: data
      }
    }).catch(err => {
      error({ statusCode: err.statusCode, message: err.message })
    })
  },

  // head () {
  //   return {
  //     title: this.project.name,
  //     meta: [
  //       {
  //         hid: 'description',
  //         name: 'description',
  //         content: this.project.description
  //       }
  //     ]
  //   }
  // },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    },

    presenter () {
      const presenters = {
        'libcrowds-viewer': LibcrowdsViewerPresenter,
        'z3950': Z3950Presenter
      }
      return presenters[this.collection.info.presenter]
    }
  },

  methods: {
    /**
     * Return the URL to load the next set of tasks
     */
    loadNewTasks () {
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
      console.log(url)
      this.$axios.$get(url).then(data => {
        if (isEmpty(data)) {
          this.handleCompletion()
        } else {
          const loadedTasks = Array.isArray(data) ? data : [data]
          this.tasks = this.tasks.concat(loadedTasks)
        }
      }).catch(err => {
        this.$nuxt.error({ statusCode: err.statusCode, message: err.message })
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
        name: 'collection-short_name-projects',
        params: {
          short_name: this.collection.short_name
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
        this.axios.$post('/api/favorite', {
          params: {
            task_id: taskId
          }
        }).then(() => {
          this.notify({
            title: 'Success',
            text: 'Removed from favourites',
            type: 'success'
          })
        }).catch(err => {
          this.$nuxt.error({ statusCode: err.statusCode, message: err.message })
        })
      } else {
        this.$axios.$delete(`/api/favorite/${taskId}`).then(() => {
          this.notify({
            title: 'Success',
            text: 'Added to favourites',
            type: 'success'
          })
        }).catch(err => {
          this.$nuxt.error({ statusCode: err.statusCode, message: err.message })
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
      this.$axios.$post(`/api/taskrun`, taskrun).then(data => {
        this.removeTask(taskId)
        if (this.tasks.length < 10) {
          this.loadNewTasks()
        }
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
      }).catch(err => {
        this.$nuxt.error({ statusCode: err.statusCode, message: err.message })
      })
    }
  },

  mounted () {
    this.loadTasks()
    this.$store.dispatch('UPDATE_COLLECTION_NAV_ITEMS', [])
  }
}
</script>
