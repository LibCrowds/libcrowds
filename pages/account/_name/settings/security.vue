<template>
  <pybossa-form
    header="Security Settings"
    submit-text="Reset Password"
    :form="form">
  </pybossa-form>
</template>

<script>
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'account-dashboard',

  async asyncData ({ params, app, error }) {
    const endpoint = `/account/${params.name}/update`
    return app.$axios.$get(endpoint).then(data => {
      data.form.btn = 'Password'
      return {
        form: {
          endpoint: `account/${params.name}/update`,
          method: 'post',
          model: data.password_form,
          schema: {
            fields: [
              {
                model: 'current_password',
                label: 'Current Password',
                type: 'input',
                inputType: 'password'
              },
              {
                model: 'new_password',
                label: 'New Password',
                type: 'input',
                inputType: 'password'
              },
              {
                model: 'confirm',
                label: 'Confirm New Password',
                type: 'input',
                inputType: 'password'
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
      title: 'Security Settings'
    }
  },

  components: {
    PybossaForm
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    }
  }
}
</script>
