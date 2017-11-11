<template>
  <card-base
    :title="title"
    help="Set a thumbnail image for the project">

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
import { fetchProjectAndCollection } from '@/mixins/fetchProjectAndCollection'
import ImageUploadForm from '@/components/forms/ImageUpload'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-project-dashboard',

  mixins: [ fetchProjectAndCollection ],

  middleware: 'is-admin',

  data () {
    return {
      title: 'Thumbnail'
    }
  },

  async asyncData ({ params, app, error }) {
    const endpoint = `/project/${params.short_name}/update`
    return app.$axios.$get(endpoint).then(data => {
      // See https://github.com/LibCrowds/libcrowds/issues/100
      delete data.upload_form.id
      data.upload_form.btn = 'Upload'
      return {
        form: {
          endpoint: `project/${params.short_name}/update`,
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
      title: this.title
    }
  },

  components: {
    ImageUploadForm,
    CardBase
  }
}
</script>
