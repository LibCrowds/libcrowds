<template>
  <image-upload-form
    header="Project Thumbnail"
    submit-text="Update"
    file-field="avatar"
    :endpoint="form.endpoint"
    :model="form.model"
    :method="form.method"
    :viewport-height="250"
    :viewport-width="250"
    crop-type="square">
  </image-upload-form>
</template>

<script>
import { fetchProjectAndCollection } from '@/mixins/fetchProjectAndCollection'
import ImageUploadForm from '@/components/forms/ImageUpload'

export default {
  layout: 'project-dashboard',

  mixins: [ fetchProjectAndCollection ],

  async asyncData ({ params, app, error }) {
    const endpoint = `/project/${params.short_name}/update`
    return app.$axios.$get(endpoint).then(data => {
      data.form.btn = 'Upload'
      return {
        form: {
          endpoint: `project/${params.short_name}/update`,
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
      title: 'Thumbnail'
    }
  },

  components: {
    ImageUploadForm
  }
}
</script>
