<template>
  <div class="presenter">

    <loading
      v-if="loading"
      text="Loading project">
    </loading>

    <libcrowds-viewer
      v-else
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
import Loading from '@/components/Loading'

export default {
  data: function () {
    return {
      loading: true,
      project: null,
      currentUser: this.$store.state.currentUser,
      tasks: []
    }
  },

  components: {
    Loading
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
     * Fetch project with the given short name.
     */
    fetchProjects (shortname) {
      return pybossaApi.get(`/api/project?short_name=${shortname}`)
    },

    /**
     * Fetch new tasks.
     */
    fetchNewTasks (limit = 100) {
      console.log(this.project)
      const url = `/api/project/${this.project.id}/newtask?limit=${limit}`
      return pybossaApi.get(url)
    },

    /**
     * Fetch a task.
     */
    fetchTask (id) {
      return pybossaApi.get(`/api/task/${id}`)
    },

    /**
     * Save the task run.
     */
    saveTaskRun (data) {
      return pybossaApi.post(`/api/taskrun`, data)
    },

    /**
     * Add a task to the user's favourites.
     */
    addFavourite (taskId) {
      return pybossaApi.post(`/api/favorites`, {
        task_id: taskId
      })
    },

    /**
     * Delete a task from the user's favourites.
     */
    deleteFavourite (taskId) {
      return pybossaApi.delete(`/api/favorites/${taskId}`)
    },

    /**
     * Handle the task liked event.
     */
    onTaskLiked (data) {
      if (data.liked) {
        this.addFavourite(data.id)
      } else {
        this.deleteFavourite(data.id)
      }
    },

    /**
     * Handle the submit event.
     */
    onSubmit (data) {
      this.fetchTask(data.id).then(r => {
        let task = r.data
        task.answer = data.annotations
        let taskrun = {
          'project_id': this.project.id,
          'task_id': data.id,
          'info': data.annotations
        }
        taskrun = JSON.stringify(taskrun)
        return this.saveTaskRun(taskrun)
      }).then(r => {
        this.$store.dispatch('NOTIFY', {
          msg: 'Answer saved!',
          type: 'success'
        })
      })
    }
  },

  metaInfo: {
    title: 'Task Presenter'
  },

  mounted () {
    const shortname = this.$store.state.route.params.shortname
    let limit = 100
    if ('limit' in this.$store.state.route.query) {
      limit = this.$store.state.route.query.limit
    }

    this.fetchProjects(shortname).then(r => {
      this.project = r.data[0]
      return this.fetchNewTasks(limit)
    }).then(r => {
      this.tasks = Array.isArray(r.data) ? r.data : [r.data]
      this.loading = false
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
