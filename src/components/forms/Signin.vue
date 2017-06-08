<template>
  <b-card class="mb-2">
    
    <b-form-fieldset 
      label="Email">
      <b-form-input
        type="text"
        label="email"
        placeholder="Enter your email address"
        v-model="form.email">
      </b-form-input>
    </b-form-fieldset>
    
    <b-form-fieldset 
      label="Password">
      <b-form-input
        type="text"
        label="Password"
        placeholder="Enter your password"
        v-model="form.password">
      </b-form-input>
    </b-form-fieldset>
    
    <b-button variant="outline-secondary">Cancel</b-button>
    <b-button variant="success" v-on:click="submit">Sign</b-button>
    
  </b-card>
</template>

<script>
import pybossaApi from '@/api/pybossa'

export default {
  data: function () {
    return {
      form: {
        csrf: null,
        email: null,
        errors: {},
        password: null
      }
    }
  },

  methods: {
    fetchData () {
      pybossaApi.get('/account/signin').then(res => {
        this.form = res.data.form
      }).catch(error => {
        console.log(error)
      })
    },
    submit () {
      pybossaApi.post('/account/signin', this.form).then(res => {
        console.log(res)
      }).catch(error => {
        console.log(error.response)
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
