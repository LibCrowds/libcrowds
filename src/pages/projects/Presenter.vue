<template>
  <div v-html="project.info.task_presenter"></div>
</template>

<script>
import pybossaApi from '@/api/pybossa'

export default {
  data: function () {
    return {
      project: {},
      title: null
    }
  },

  methods: {
    fetchProject () {
      const shortname = this.$store.state.route.params.shortname
      const url = `/project/${shortname}/`
      pybossaApi.get(url).then(res => {
        this.project = res.data.project
        this.title = res.data.title
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

<style lang="scss" scoped>
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';
</style>
