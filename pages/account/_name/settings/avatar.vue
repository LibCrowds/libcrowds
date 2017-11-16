<template>
  <image-upload-form
    header="Avatar Settings"
    submit-text="Update Avatar"
    file-field="avatar"
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
    const endpoint = `/account/${params.name}/update?response_format=json`
    return app.$axios.$get(endpoint).then(data => {
      // See https://github.com/LibCrowds/libcrowds/issues/100
      delete data.upload_form.id

      data.upload_form.btn = 'Upload'
      return {
        form: {
          endpoint: endpoint,
          model: data.upload_form,
          method: 'POST'
        }
      }
    }).catch(err => {
      error(err)
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
