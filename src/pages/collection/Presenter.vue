<template>
  <div id="presenter">
    <component
      :is="presenter"
      v-if="project && tasks"
      :project="project"
      :tasks="tasks"
      :currentUser="currentUser"
      :collectionConfig="collectionConfig"
      @submit="onSubmit"
      @taskLiked="onTaskLiked">
    </component>
  </div>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import LibcrowdsViewerPresenter from '@/components/presenters/LibcrowdsViewer'
import Z3950Presenter from '@/components/presenters/Z3950'
import DefaultPresenter from '@/components/presenters/Default'

export default {
  data: function () {
    return {
      project: null,
      tasks: null,
      title: '',
      description: '',
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

  metaInfo () {
    return {
      title: this.title,
      meta: [
        {
          name: 'description',
          content: this.description
        }
      ]
    }
  },

  props: {
    collectionConfig: {
      type: Object,
      required: true
    },
    currentUser: {
      type: Object,
      required: true
    }
  },

  computed: {
    presenter: function () {
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
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      this.project = data.project
      this.tasks = data.tasks
      this.title = this.project.name
      this.description = this.project.description
    },

    /**
     * Load the next set of tasks.
     *
     * Always keep between 10 and 30 in the queue.
     */
    loadTasks () {
      if (this.tasks.length > 10) {
        return
      }
      const endpoint = `/api/project/${this.project.id}/newtask`
      let q = 'limit=20'
      if (this.tasks.length) {
        const lastTask = this.tasks[this.tasks.length - 1]
        q += `&last_id=${lastTask.id}`
      }
      const url = `${endpoint}?${q}`
      pybossaApi.get(url).then(r => {
        const loadedTasks = Array.isArray(r.data) ? r.data : [r.data]
        this.tasks = this.tasks.concat(loadedTasks)
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
        pybossaApi.post(`/api/favorites`, { task_id: taskId }).then(() => {
          // TODO: feedback
        })
      } else {
        pybossaApi.delete(`/api/favorites/${taskId}`).then(() => {
          // TODO: feedback
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
      const taskrun = JSON.stringify({
        'project_id': projectId,
        'task_id': taskId,
        'info': answer
      })
      pybossaApi.post(`/api/taskrun`, taskrun).then(r => {
        this.removeTask(taskId)
        this.loadTasks()
        // TODO: feedback
      })
    }
  },

  beforeRouteEnter (to, from, next) {
    let data = {}
    pybossaApi.get(`/project/${to.params.shortname}/`).then(r => {
      data = r.data
      return pybossaApi.get(`/api/project/${data.project.id}/newtask`)
    }).then(r => {
      data.tasks = Array.isArray(r.data) ? r.data : [r.data]
      next(vm => vm.setData(data))
    })
  },

  beforeRouteUpdate (to, from, next) {
    let data = {}
    pybossaApi.get(`/project/${to.params.shortname}/`).then(r => {
      data = r.data
      return pybossaApi.get(`/api/project/${data.project.id}/newtask`)
    }).then(r => {
      data.tasks = Array.isArray(r.data) ? r.data : [r.data]
      this.setData(data)
      next()
    })
  },

  mounted () {
    this.$emit('navupdated', this.navItems)
  }
}
</script>
