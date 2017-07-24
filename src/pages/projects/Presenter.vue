<template>
  <div class="presenter">

    <div v-if="loading">
      <loading></loading>
    </div>

    <libcrowds-viewer
      v-else
      show-like
      :taskOpts="taskOpts"
      :creator="creator"
      :generator="generator"
      @submit="handleLibCrowdsViewerSubmit">
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

    handleLibCrowdsViewerSubmit (data) {
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

  mounted () {
    this.fetchProjects().then(r => {
      this.project = r.data[0]
      return this.fetchNewTasks()
    }).then(r => {
      this.tasks = r.data
      this.loading = false
    })
  }
}
</script>

<style>
#app-footer,
#app-navbar {
  display: none;
}

.presenter {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
