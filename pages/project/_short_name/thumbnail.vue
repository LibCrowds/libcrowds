<template>
  <avatar-form
    header="Project Thumbnail"
    submit-text="Update"
    :viewport-height="250"
    :viewport-width="250"
    crop-type="square"
    :form="form">
  </avatar-form>
</template>

<script>
import { fetchProjectAndCollection } from '@/mixins/fetchProjectAndCollection'
import AvatarForm from '@/components/forms/AvatarForm'

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
          model: data.upload_form
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
    AvatarForm
  }
}
</script>
