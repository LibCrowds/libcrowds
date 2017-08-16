<template>
  <div class="presenter">

    <libcrowds-viewer
      :confirm-before-unload="true"
      :disable-complete="true"
      :show-like="showLike"
      :taskOpts="taskOpts"
      :creator="creator"
      :generator="generator"
      @submit="onSubmit"
      @taskliked="onTaskLiked">
    </libcrowds-viewer>

  </div>
</template>

<script>
import siteConfig from '@/settings/siteConfig'
import pybossaApi from '@/api/pybossa'

export default {
  data: function () {
    return {
      project: null,
      tasks: []
    }
  },

  props: {
    projectName: {
      type: String,
      required: true
    }
  },

  metaInfo: {
    title: 'Task Presenter'
  },

  computed: {
    taskOpts: function () {
      const currentUser = this.$store.state.currentUser
      return this.tasks.map((task) => {
        let opts = task.info
        opts.id = task.id
        if (currentUser && task.fav_user_ids) {
          opts.liked = task.fav_user_ids.indexOf(currentUser.id) > -1
        }
        return opts
      })
    },
    creator: function () {
      const baseApiUrl = siteConfig.pybossaHost
      const currentUser = this.$store.state.currentUser
      if (currentUser) {
        return {
          id: `${baseApiUrl}/api/user/${currentUser.id}`,
          type: 'Person',
          name: currentUser.fullname,
          nickname: currentUser.name
        }
      }
      return null
    },
    generator: function () {
      const baseApiUrl = siteConfig.pybossaHost
      if (this.project) {
        return {
          id: `${baseApiUrl}/api/project/${this.project.id}`,
          type: 'Software',
          name: `${siteConfig.brand} - ${this.project.name}`,
          homepage: `${window.location.protocol}//${window.location.hostname}`
        }
      }
    },
    showLike: function () {
      return this.$store.state.currentUser !== null
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
     * Clear core data.
     */
    clearData () {
      this.project = {}
      this.tasks = []
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
    pybossaApi.get(`/project/${to.params.shortname}/`).then(r => {
      data.project = r.data.project
      return pybossaApi.get(`/api/project/${data.project.id}/newtask?limit=100`)
    }).then(r => {
      data.tasks = Array.isArray(r.data) ? r.data : [r.data]
      next(vm => vm.setData(data))
    })
  },

  beforeRouteUpdate (to, from, next) {
    this.clearData()
    let data = {}
    pybossaApi.get(`/project/${to.params.shortname}/`).then(r => {
      data.project = r.data.project
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
