<template>
  <form v-on:submit.prevent>

    <b-form-fieldset
      v-for="f in fields"
      :key="f.name"
      :feedback="getFeedback(f.name)"
      :state="getState(f.name)">
      <b-form-input
        required
        :type="f.type"
        :placeholder="f.name"
        :state="getState(f.name)"
        v-model="form[f.name]"
        v-on:keyup.enter="submit">
      </b-form-input>
    </b-form-fieldset>

    <b-button
      variant="success"
      v-on:click="submit">
      Sign in
    </b-button>
  </form>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import router from '@/router'

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

  props: [
    'endpoint',
    'fields'
  ],

  methods: {
    fetch () {
      pybossaApi.get(this.endpoint).then(r => {
        this.handleResponse(r)
      })
    },
    submit () {
      if (document.querySelector('form').checkValidity()) {
        pybossaApi.post(this.endpoint, this.form, {
          headers: {
            'X-CSRFToken': this.form.csrf
          }
        }).then(r => {
          this.handleResponse(r)
        })
      }
    },
    handleResponse (r) {
      if ('next' in r.data) {
        router.push({ path: r.data.next })
      }
      this.form = r.data.form
      this.$emit('response', r)
    },
    getFeedback (field) {
      const fb = this.form.errors[field]
      if (!fb) {
        return
      }
      return fb.join()
    },
    getState (field) {
      return field in this.form.errors ? 'danger' : null
    }
  },

  mounted () {
    this.fetch()
  }
}
</script>
