<template>
  <card-form
    id="admin-update-announcement"
    header="Update Announcement"
    submit-text="Update"
    :form="form"
    @success="onSuccess">
  </card-form>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import CardForm from '@/components/forms/CardForm'

export default {
  data: function () {
    return {
      announcementId: null,
      model: {}
    }
  },

  computed: {
    form: function () {
      return {
        endpoint: `/admin/announcement/${this.announcementId}/update`,
        method: 'post',
        model: this.model,
        schema: {
          fields: [
            {
              model: 'title',
              label: 'Title',
              type: 'input',
              inputType: 'text'
            },
            {
              model: 'body',
              label: 'Body',
              type: 'textArea',
              rows: 3,
              placeholder: 'Use Markdown'
            }
          ]
        }
      }
    }
  },

  metaInfo () {
    return {
      title: 'Update Announcement'
    }
  },

  components: {
    CardForm
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      this.model = data.form
      this.announcementId = data.form.id
    },

    /**
     * Handle success.
     * @param {Object} data
     *   The response data
     */
    onSuccess (data) {
      this.$router.push({ name: 'admin-announcements' })
    }
  },

  beforeRouteEnter (to, from, next) {
    let id = to.params.id
    pybossaApi.get(`/admin/announcement/${id}/update`).then(r => {
      next(vm => vm.setData(r.data))
    })
  }
}
</script>
