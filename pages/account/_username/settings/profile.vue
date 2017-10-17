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
  layout: 'dashboard',

  async asyncData ({ params, app }) {
    const res = await app.$pybossa.getUpdateProfile(params.username)
    res.data.form.btn = 'Profile'
    return {
      form: {
        endpoint: `account/${params.username}/update`,
        method: 'post',
        model: res.data.form,
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
  },

  head () {
    return {
      title: `${this.currentUser.fullname}: Profile Settings`
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
      this.$store.dispatch('UPDATE_CURRENT_USER', this.$pybossa)
    }
  }
}
</script>
