<template>
  <div class="presenter">

    <div v-if="loading">
      <loading></loading>
    </div>

    <div v-else v-html="presenter"></div>

  </div>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import Loading from '@/components/Loading'

export default {
  data: function () {
    return {
      loading: true,
      project: {},
      title: null
    }
  },

  components: {
    Loading
  },

  computed: {
    presenter: function () {
      return 'info' in this.project ? this.project.info.task_presenter : ''
    }
  },

  methods: {
    fetchProject () {
      const shortname = this.$store.state.route.params.shortname
      const url = `/project/${shortname}/`
      pybossaApi.get(url).then(res => {
        this.project = res.data.project
        this.title = res.data.title
        this.loading = false
      }).catch(error => {
        console.log(error)
      })
    }
  },

  metaInfo: {
    title: this.title,
    bodyAttrs: {
      style: 'background: #000000'
    }
  },

  created () {
    this.fetchProject()
  }
}
</script>
