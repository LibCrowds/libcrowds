<template>
  <avatar-form
    header="Avatar Settings"
    submit-text="Update Avatar"
    :form="form">
  </avatar-form>
</template>

<script>
import pybossa from '@/api/pybossa'
import AvatarForm from '@/components/forms/AvatarForm'

export default {
  layout: 'dashboards/account',

  async asyncData ({ params }) {
    const res = await pybossa.getUpdateProfile(params.username)
    res.data.form.btn = 'Upload'
    return {
      form: {
        endpoint: `account/${params.username}/update`,
        model: res.data.upload_form
      }
    }
  },

  head () {
    return {
      title: `${this.currentUser.fullname}: Avatar Settings`
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
      this.$store.dispatch('UPDATE_CURRENT_USER')
    }
  }
}
</script>
