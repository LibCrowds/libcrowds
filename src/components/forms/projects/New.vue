<template>
  <form>
    <b-form-input 
      type="text" 
      placeholder="Enter a name for the project"
      v-model="form.name">
    </b-form-input>
    <b-form-input 
      type="text" 
      placeholder="Enter a tagline for the project" 
      v-model="form.description">
    </b-form-input>
    <b-form-input 
      type="text"
      textarea
      placeholder="Enter a description of the project"
      v-model="form.long_description"></b-form-input>
    <b-button variant="outline-secondary"></b-button>
    <b-button variant="success" v-on:click="submit"></b-button>
  </form>
</template>

<script>
import pybossaApi from '@/api/pybossa'

export default {
  data: function () {
    return {
      form: {
        csrf: '',
        description: null,
        errors: {},
        long_description: null,
        name: null,
        short_name: null
      }
    }
  },

  methods: {
    fetchData () {
      console.log('fetching')
      pybossaApi.get('/project/new').then(res => {
        console.log('ok')
        console.log(res)
      }).catch(error => {
        console.log(error)
      })
    },
    submit () {
      pybossaApi.post('project/new', {
        headers: {
          'X-CSRF-Token': this.csrf
        },
        data: this.form
      }).then(res => {
        console.log(res)
      }).catch(error => {
        console.log(error)
      })
    }
  },

  mounted () {
    console.log('mounting')
    this.fetchData()
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';
</style>
