<template>
  <card-base :title="title" :description="description">
    <image-upload-form
      submit-text="Update Avatar"
      file-field="avatar"
      :endpoint="form.endpoint"
      :model="form.model"
      :method="form.method"
      :current-image-url="currentImageUrl">
    </image-upload-form>
  </card-base>
</template>

<script>
import localConfig from '@/local.config'
import ImageUploadForm from '@/components/forms/ImageUpload'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'account-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'Avatar Settings',
      description: `Update your ${localConfig.brand} avatar.`
    }
  },

  asyncData ({ params, app, error }) {
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

  components: {
    ImageUploadForm,
    CardBase
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },

    currentImageUrl () {
      const thumbnailUrl = this.currentUser.info.avatar_url
      if (typeof thumbnailUrl === 'undefined' || thumbnailUrl === null) {
        return ''
      } else if (thumbnailUrl.indexOf('/uploads') === 0) {
        return localConfig.pybossaHost + thumbnailUrl
      }
      return thumbnailUrl
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
