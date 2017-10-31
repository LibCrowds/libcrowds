<template>
  <pybossa-form
    header="Profile Settings"
    submit-text="Update"
    :form="form"
    @success="updateCurrentUser">
  </pybossa-form>
</template>

<script>
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'account-dashboard',

  async asyncData ({ params, app, error }) {
    const endpoint = `/account/${params.name}/update`
    return app.$axios.$get(endpoint).then(data => {
      data.form.btn = 'Profile'
      return {
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

  head () {
    return {
      title: 'Profile Settings'
    }
  },

  components: {
    PybossaForm
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
    updateCurrentUser () {
      this.$store.dispatch('UPDATE_CURRENT_USER', this.$axios)
    }
  }
}
</script>
