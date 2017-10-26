<template>
  <image-upload-form
    header="Avatar Settings"
    submit-text="Update Avatar"
    :endpoint="form.endpoint"
    :model="form.model"
    :method="form.method">
  </image-upload-form>
</template>

<script>
import ImageUploadForm from '@/components/forms/ImageUpload'

export default {
  layout: 'account-dashboard',

  async asyncData ({ params, app, error }) {
    const endpoint = `/account/${params.username}/update`
    return app.$axios.$get(endpoint).then(data => {
      data.form.btn = 'Upload'
      return {
        form: {
          endpoint: `account/${params.username}/update`,
          model: data.upload_form,
          method: 'POST'
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
    ImageUploadForm
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
