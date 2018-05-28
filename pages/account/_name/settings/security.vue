<template>
  <card-base :title="title" :description="description">
    <pybossa-form
      submit-text="Reset Password"
      :form="form">
    </pybossa-form>
  </card-base>
</template>

<script>
import VueFormGenerator from 'vue-form-generator'
import localConfig from '@/local.config'
import PybossaForm from '@/components/forms/PybossaForm'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'account-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'Security Settings',
      description: `Update your ${localConfig.brand} password.`
    }
  },

  asyncData ({ params, app, error }) {
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
                inputType: 'password',
                hint: 'Your current password',
                required: true,
                validator: VueFormGenerator.validators.string
              },
              {
                model: 'new_password',
                label: 'New Password',
                type: 'input',
                inputType: 'password',
                hint: 'Your new password',
                required: true,
                validator: VueFormGenerator.validators.string
              },
              {
                model: 'confirm',
                label: 'Confirm New Password',
                type: 'input',
                inputType: 'password',
                hint: 'Confirmation of your new password',
                required: true,
                validator: VueFormGenerator.validators.string
              }
            ]
          }
        }
      }
    }).catch(err => {
      error(err)
    })
  },

  components: {
    PybossaForm,
    CardBase
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    }
  }
}
</script>
