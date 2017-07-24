<template>
  <div class="presenter">

    <div v-if="loading">
      <loading></loading>
    </div>

    <div v-else-if="presenter" v-html="presenter"></div>

  </div>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import Loading from '@/components/Loading'
import stripAndExecuteScript from '@/utils/strip-and-execute-scripts'

export default {
  data: function () {
    return {
      loading: true,
      presenter: null
    }
  },

  components: {
    Loading
  },

  methods: {
    fetchProject () {
      const shortname = this.$store.state.route.params.shortname
      pybossaApi.get(`/project/${shortname}/`).then(r => {
        this.presenter = 'info' in this.project
          ? this.project.info.task_presenter
          : ''
        stripAndExecuteScript(this.presenter)
        this.loading = false
      })
    }
  },

  metaInfo: {
    bodyAttrs: {
      style: 'background: #000000'
    }
  },

  created () {
    this.fetchProject()
  }
}
</script>
