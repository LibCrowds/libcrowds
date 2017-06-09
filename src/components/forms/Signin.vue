<template>
  <b-card class="mb-2">

    <b-form-fieldset
      label="Email">
      <b-form-input
        type="text"
        label="email"
        :feedback="form.errors.email"
        :state="getState('email')"
        placeholder="Enter your email address"
        v-model="form.email">
      </b-form-input>
    </b-form-fieldset>

    <b-form-fieldset
      label="Password">
      <b-form-input
        type="text"
        label="Password"
        :feedback="form.errors.password"
        :state="'password' in form.errors ? 'error' : null"
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

  computed: {

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
      pybossaApi.post('/account/signin', this.form, {
        headers: {
          'X-CSRFToken': this.form.csrf
        }
      }).then(res => {
        this.form = res.data.form
      }).catch(error => {
        console.log(error.response)
      })
    },
    getFeedback (field) {
      return this.form.errors[field]
    },
    getState (field) {
      console.log(this.form.errors.email)
      return field in this.form.errors ? 'error' : null
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
