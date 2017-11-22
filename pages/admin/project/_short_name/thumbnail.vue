<template>
  <card-base :title="title" :description="description">

    <image-upload-form
      submit-text="Update"
      file-field="avatar"
      :endpoint="form.endpoint"
      :model="form.model"
      :method="form.method"
      :viewport-height="250"
      :viewport-width="250"
      no-border
      crop-type="square">
    </image-upload-form>

  </card-base>
</template>

<script>
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

  async asyncData ({ params, app, error }) {
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
  }
}
</script>
