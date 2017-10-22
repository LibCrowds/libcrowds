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
import AvatarForm from '@/components/forms/AvatarForm'

export default {
  layout: 'project-dashboard',

  async asyncData ({ params, app, error }) {
    const endpoint = `/project/${params.shortname}/update`
    return app.$axios.$get(endpoint).then(data => {
      data.form.btn = 'Upload'
      return {
        project: data.project,
        form: {
          endpoint: `project/${params.shortname}/update`,
          model: data.upload_form
        }
      }
    }).catch(err => {
      error({ statusCode: err.statusCode, message: err.message })
    })
  },

  head () {
    return {
      title: `${this.project.name}: Settings`
    }
  },

  components: {
    AvatarForm
  }
}
</script>
