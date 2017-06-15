<template>
  <div></div>
</template>

<script>
import pybossaApi from '@/api/pybossa'

export default {
  props: [
    'project'
  ],

  methods: {
    fetchProject () {
      const projectname = this.$store.state.route.params.projectname
      console.log('fetching')
      pybossaApi.get(`/project/${projectname}`).then(res => {
        console.log('ok')
        console.log(res)
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';
</style>
