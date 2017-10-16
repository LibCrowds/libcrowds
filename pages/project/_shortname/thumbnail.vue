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
  layout: 'dashboard',

  async asyncData ({ params, app }) {
    const res = await app.$pybossa.getUpdateProject(params.shortname)
    res.data.form.btn = 'Upload'
    return {
      project: res.data.project,
      form: {
        endpoint: `project/${params.shortname}/update`,
        model: res.data.upload_form
      }
    }
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
