<template>
  <avatar-form
    v-if="!loading"
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
  data: function () {
    return {
      loading: true,
      project: {},
      model: {}
    }
  },

  metaInfo () {
    return {
      title: `${this.project.name}: Settings`
    }
  },

  components: {
    AvatarForm
  },

  computed: {
    form: function () {
      return {
        endpoint: `project/${this.project.short_name}/update`,
        model: this.model
      }
    }
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      this.project = data.project
      this.model = data.upload_form
      this.model.btn = 'Upload'
      this.loading = false
    }
  },

  beforeRouteEnter (to, from, next) {
    pybossaApi.get(`project/${to.params.shortname}/update`).then(r => {
      next(vm => vm.setData(r.data))
    })
  },

  beforeRouteUpdate (to, from, next) {
    pybossaApi.get(`project/${to.params.shortname}/update`).then(r => {
      this.setData(r.data)
      next()
    })
  }
}
</script>
