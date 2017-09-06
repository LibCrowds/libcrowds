<template>
  <avatar-form
    v-if="!loading"
    :header="'Avatar Settings'"
    :submitText="'Update Avatar'"
    :form="form">
  </avatar-form>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import AvatarForm from '@/components/forms/AvatarForm'

export default {
  data: function () {
    return {
      loading: true,
      form: {
        endpoint: `account/${this.currentUser.name}/update`,
        model: {}
      }
    }
  },

  metaInfo () {
    return {
      title: `${this.currentUser.fullname}: Avatar Settings`
    }
  },

  props: {
    currentUser: {
      type: Object,
      required: true
    }
  },

  components: {
    AvatarForm
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      this.form.model = data.upload_form
      this.form.model.btn = 'Upload'
      this.loading = false
    },

    /**
     * Trigger an update of the current user.
     */
    updateCurrentUser () {
      this.$store.dispatch('UPDATE_CURRENT_USER')
    }
  },

  beforeRouteEnter (to, from, next) {
    pybossaApi.get(`account/${to.params.username}/update`).then(r => {
      next(vm => vm.setData(r.data))
    })
  },

  beforeRouteUpdate (to, from, next) {
    this.form.model = {}
    this.loading = true
    pybossaApi.get(`account/${to.params.username}/update`).then(r => {
      this.setData(r.data)
      next()
    })
  }
}
</script>
