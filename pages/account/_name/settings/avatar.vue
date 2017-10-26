<template>
  <avatar-form
    header="Avatar Settings"
    submit-text="Update Avatar"
    :form="form">
  </avatar-form>
</template>

<script>
import AvatarForm from '@/components/forms/AvatarForm'

export default {
  layout: 'account-dashboard',

  async asyncData ({ params, app, error }) {
    const endpoint = `/account/${params.username}/update`
    return app.$axios.$get(endpoint).then(data => {
      data.form.btn = 'Upload'
      return {
        form: {
          endpoint: `account/${params.username}/update`,
          model: data.upload_form
        }
      }
    }).catch(err => {
      error({ statusCode: err.statusCode, message: err.message })
    })
  },

  head () {
    return {
      title: 'Avatar Settings'
    }
  },

  components: {
    AvatarForm
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
