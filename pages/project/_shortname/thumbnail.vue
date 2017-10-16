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
import pybossa from '@/api/pybossa'

export default {
  layout: 'dashboard',

  async asyncData ({ params }) {
    const res = await pybossa.getUpdateProject(params.shortname)
    res.data.form.btn = 'Upload'
    return {
      project: res.data.project,
      form: {
        endpoint: `project/${params.shortname}/update`,
        model: res.data.upload_form
      }
    }
  },

  metaInfo () {
    return {
      title: `${this.project.name}: Settings`
    }
  },

  components: {
    AvatarForm
  }
}
</script>
