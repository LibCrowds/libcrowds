<template>
  <div class="presenter">

    <libcrowds-viewer
      :confirm-before-unload="true"
      :disable-complete="true"
      :show-like="currentUser !== null && currentUser !== undefined"
      :taskOpts="taskOpts"
      :creator="creator"
      :generator="generator"
      @submit="onSubmit"
      @taskliked="onTaskLiked">
    </libcrowds-viewer>

  </div>
</template>

<script>
import config from '@/config'
import pybossaApi from '@/api/pybossa'

export default {
  data: function () {
    return {
      project: null,
      currentUser: this.$store.state.currentUser,
      tasks: []
    }
  },

  metaInfo: {
    title: 'Task Presenter'
  },

  computed: {
    taskOpts: function () {
      return this.tasks.map(function (task) {
        let opts = task.info
        opts.id = task.id
        return opts
      })
    },
    creator: function () {
      const baseApiUrl = config.pybossaHost
      if (this.currentUser) {
        return {
          id: `${baseApiUrl}/api/user/${this.currentUser.id}`,
          type: 'Person',
          name: this.currentUser.fullname,
          nickname: this.currentUser.name
        }
      }
      return null
    },
    generator: function () {
      const baseApiUrl = config.pybossaHost
      if (this.project) {
        return {
          id: `${baseApiUrl}/api/project/${this.project.id}`,
          type: 'Software',
          name: `${config.brand} - ${this.project.name}`,
          homepage: `${window.location.protocol}//${window.location.hostname}`
        }
      }
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
    },

    /**
     * Handle the task liked event.
     * @param {Object} task
     *   The task.
     */
    onTaskLiked (task) {
      if (task.liked) {
        pybossaApi.post(`/api/favorites`, { task_id: task.id })
      } else {
        pybossaApi.delete(`/api/favorites/${task.id}`)
      }
    },

    /**
     * Handle the submit event.
     * @param {Object} task
     *   The task.
     */
    onSubmit (task) {
      const taskrun = JSON.stringify({
        'project_id': this.project.id,
        'task_id': task.id,
        'info': task.annotations
      })
      pybossaApi.post(`/api/taskrun`, taskrun).then(r => {
        this.$store.dispatch('NOTIFY', {
          msg: 'Answer saved!',
          type: 'success'
        })
      })
    }
  },

  beforeRouteEnter (to, from, next) {
    let data = {}
    pybossaApi.get(`/api/project?short_name=${to.params.shortname}`).then(r => {
      data.project = r.data[0]
      return pybossaApi.get(`/api/project/${data.project.id}/newtask?limit=100`)
    }).then(r => {
      data.tasks = Array.isArray(r.data) ? r.data : [r.data]
      next(vm => vm.setData(data))
    })
  },

  beforeRouteUpdate (to, from, next) {
    this.project = null
    this.tasks = []
    let data = {}
    pybossaApi.get(`/api/project?short_name=${to.params.shortname}`).then(r => {
      data.project = r.data[0]
      return pybossaApi.get(`/api/project/${data.project.id}/newtask?limit=100`)
    }).then(r => {
      data.tasks = Array.isArray(r.data) ? r.data : [r.data]
      this.setData(data)
      next()
    })
  }
}
</script>

<style>
.presenter {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 9999999;
  background-color: #000;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
