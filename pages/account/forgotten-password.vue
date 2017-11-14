<template>
  <pybossa-form
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

  data () {
    return {
      title: 'Forgotten Password'
    }
  },

  async asyncData ({ query, app, error }) {
    const endpoint = '/account/forgot-password'
    return app.$axios.$get(endpoint).then(data => {
      return {
        next: query.next || '/',
        form: {
          endpoint: endpoint,
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
      error(err)
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
