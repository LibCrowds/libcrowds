<template>
  <form>
    <b-form-input type="text" placeholder="Enter your name"></b-form-input>
  </form>
</template>

<script>
import pybossaApi from '@/api/pybossa'

export default {
  methods: {
    fetchData () {
      pybossaApi.get('project/new').then(res => {
        console.log(res)
      }).catch(error => {
        console.log(error)
      })
    }
  },

  mounted () {
    this.fetchData()
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';
</style>
