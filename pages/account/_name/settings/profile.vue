<template>
  <card-base :title="title" :description="description">
    <pybossa-form
      submit-text="Update"
      :form="form"
      @success="onSuccess">
    </pybossa-form>
  </card-base>
</template>

<script>
import localConfig from '@/local.config'
import PybossaForm from '@/components/forms/PybossaForm'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'account-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'Profile Settings',
      description: `Update your ${localConfig.brand} profile settings.`
    }
  },

  async asyncData ({ params, app, error }) {
    const endpoint = `/account/${params.name}/update`
    return app.$axios.$get(endpoint).then(data => {
      data.form.btn = 'Profile'
      return {
        originalEmail: data.form.email_addr,
        form: {
          endpoint: `account/${params.name}/update`,
          method: 'post',
          model: data.form,
          schema: {
            fields: [
              {
                model: 'fullname',
                label: 'Full name',
                type: 'input',
                inputType: 'text'
              },
              {
                model: 'name',
                label: 'Username',
                type: 'input',
                inputType: 'text'
              },
              {
                model: 'email_addr',
                label: 'Email',
                type: 'input',
                inputType: 'email'
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
  },

  methods: {
    /**
     * Trigger an update of the current user.
     */
    onSuccess () {
      const action = 'UPDATE_CURRENT_USER'
      return this.$store.dispatch(action, this.$axios).then(user => {
        // Update the email address in Flarum so a new user is not created.
        if (this.$flarum && this.originalEmail !== user.email_addr) {
          this.$flarum.updateUserEmail(this.originalEmail, user.email_addr)
        }
      })
    }
  }
}
</script>
