<template>
  <div class="presenter">

    <loading
      v-if="loading"
      text="Loading project">
    </loading>

    <libcrowds-viewer
      v-else
      :show-like="currentUser.length"
      :taskOpts="taskOpts"
      :creator="creator"
      :generator="generator"
      @submit="handleSubmit"
      @taskliked="handleTaskLiked">
    </libcrowds-viewer>

  </div>
</template>

<script>
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
        console.log(task)
        let opts = task.info
        opts.id = task.id
        return opts
      })
    },
    creator: function () {
      return null
    },
    generator: function () {
      if (this.project) {
        return {
          id: `/api/project/${this.project.id}`,
          type: 'Software',
          name: this.project.name,
          homepage: `/project/${this.project.short_name}`
        }
      }
    }
  },

  methods: {
    fetchProjects () {
      const shortname = this.$store.state.route.params.shortname
      return pybossaApi.get(`/api/project?short_name=${shortname}`)
    },

    fetchNewTasks () {
      return pybossaApi.get(`/api/project/${this.project.id}/newtask?limit=100`)
    },

    fetchTask (id) {
      return pybossaApi.get(`/api/task/${id}`)
    },

    saveTaskRun (data) {
      return pybossaApi.post(`/api/taskrun`, data)
    },

    /**
     * Add a task to the user's favourites.
     */
    addFavourite (taskId) {
      return pybossaApi.delete(`/api/favorites`, {
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
    handleTaskLiked (data) {
      if (data.liked) {
        this.addFavourite(data.id)
      } else {
        this.deleteFavourite(data.id)
      }
    },

    /**
     * Handle the submit event.
     */
    handleSubmit (data) {
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
    bodyAttrs: {
      style: 'background: #000000'
    }
  },

  /**
   * Hide the main navbar and footer.
   */
  hideNavbarAndFooter (hide) {
    const displayStyle = hide ? 'none' : 'block'
    document.querySelector('#app-navbar').style.display = displayStyle
    document.querySelector('#app-footer').style.display = displayStyle
  },

  mounted () {
    this.fetchProjects().then(r => {
      this.project = r.data[0]
      return this.fetchNewTasks()
    }).then(r => {
      this.tasks = r.data
      this.loading = false
    })
    this.hideNavbarAndFooter(true)
  },

  beforeDestoy () {
    this.hideNavbarAndFooter(false)
  }
}
</script>

<style>
.presenter {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: #000;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
