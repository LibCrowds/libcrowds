<template>
  <card-base
    :title="title"
    :description="description"
    docs="/projects/thumbnail/">
    <p slot="guidance">
      Use the form below to select a thumbnail image for the project.
    </p>
    <image-upload-form
      submit-text="Update"
      file-field="avatar"
      :endpoint="form.endpoint"
      :model="form.model"
      :method="form.method"
      :viewport-height="250"
      :viewport-width="250"
      :current-image-url="currentImageUrl"
      crop-type="square">
    </image-upload-form>

  </card-base>
</template>

<script>
import localConfig from '@/local.config'
import { metaTags } from '@/mixins/metaTags'
import { fetchProjectAndCollection } from '@/mixins/fetchProjectAndCollection'
import ImageUploadForm from '@/components/forms/ImageUpload'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-project-dashboard',

  mixins: [ fetchProjectAndCollection, metaTags ],

  data () {
    return {
      title: 'Thumbnail',
      description: 'Set a thumbnail image for the project'
    }
  },

  asyncData ({ params, app, error }) {
    const endpoint = `/project/${params.short_name}/update?response_format=json`
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
    currentImageUrl () {
      const currentProject = this.$store.state.currentProject
      const thumbnailUrl = currentProject.info.thumbnail_url
      if (typeof thumbnailUrl === 'undefined' || thumbnailUrl === null) {
        return ''
      } else if (thumbnailUrl.indexOf('/uploads') === 0) {
        return localConfig.pybossaHost + thumbnailUrl
      }
      return thumbnailUrl
    }
  }
}
</script>
