<template>
  <no-ssr>
    <pybossa-form
      id="reset-password"
      :header="title"
      submitText="Reset"
      :form="form",
      :next="next">
    </pybossa-form>
  </no-ssr>
</template>

<script>
import localConfig from '@/local.config'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'container',

  data () {
    return {
      title: 'Reset Password',
      model: {}
    }
  },

  computed: {
    form () {
      return {
        endpoint: '/account/reset-password',
        method: 'post',
        model: this.model,
        params: this.$route.query.key,
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
    },

    next () {
      return this.$route.query.next || '/'
    }
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

  mounted () {
    // Get the data from the client
    this.$axios.$get('/account/reset-password', {
      params: {
        key: this.$route.query.key
      }
    }).then(data => {
      this.model = data.form
    }).catch(err => {
      this.$nuxt.error(err)
    })
  },

  validate ({ query }) {
    return query.hasOwnProperty('key')
  }
}
</script>
