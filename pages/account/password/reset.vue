<template>
  <pybossa-form
    id="reset-password"
    :header="title"
    submitText="Reset"
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
    const endpoint = '/account/reset-password'
    return app.$axios.$get(endpoint).then(data => {
      return {
        title: 'Reset Password',
        next: query.next || '/',
        form: {
          endpoint: '/account/reset-password',
          method: 'post',
          model: data.form,
          params: query || null,
          schema: {
            fields: [
              {
                model: 'new_password',
                label: 'New Password',
                type: 'input',
                inputType: 'password',
                placeholder: 'Choose a new password'
              },
              {
                model: 'confirm',
                label: 'Confirm Password',
                type: 'input',
                inputType: 'password',
                placeholder: 'Confirm your new password'
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
