<template>
  <pybossa-form
    id="forgotten-password"
    :header="title"
    submit-text="Reset"
    :form="form"
    :next="next">
  </pybossa-form>
</template>

<script>
import localConfig from '@/local.config'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'container',

  async asyncData ({ query, app, error }) {
    const endpoint = '/account/forgot-password'
    return app.$axios.$get(endpoint).then(data => {
      return {
        title: 'Forgotten Password',
        next: query.next || '/',
        form: {
          endpoint: '/account/forgot-password',
          method: 'post',
          model: data.form,
          schema: {
            fields: [
              {
                model: 'email_addr',
                label: 'Email',
                type: 'input',
                inputType: 'email',
                placeholder: 'you@example.com'
              }
            ]
          }
        }
      }
    }).catch(err => {
      error({ statusCode: err.statusCode, message: err.message })
    })
  },

  head () {
    return {
      title: this.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Reset your ${localConfig.brand} password`
        }
      ]
    }
  },

  components: {
    PybossaForm
  }
}
</script>
