<template>
  <pybossa-form
    v-if="!hasError"
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

  data () {
    return {
      title: 'Reset Password'
    }
  },

  async asyncData ({ query, app, error }) {
    const endpoint = '/account/reset-password'
    const params = {
      key: query.key
    }

    /* eslint-disable handle-callback-err */
    return app.$axios.$get(endpoint, { params: params }).then(data => {
      return {
        hasError: false,
        next: query.next || '/',
        form: {
          endpoint: endpoint,
          method: 'post',
          model: data.form,
          params: params,
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
      // Failure causes a 500 error on the server where really the cause
      // is most likely to be an incorrect/expired key, so let's set a flag
      // and display a better feedback message for the user.
      return {
        form: null,
        hasError: true
      }
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
  },

  validate ({ query }) {
    return query.hasOwnProperty('key')
  },

  beforeMount () {
    if (this.hasError) {
      this.$router.push({ path: '/' })
      this.$swal({
        title: 'Invalid Key',
        html: `<p>The password reset URL is invalid, probably because the link
          has expired.</p><p>Please try submitting the password reset form
          again.</p>`,
        type: 'warning'
      })
    }
  }
}
</script>
