<template>
  <card-form
    id="admin-announcement-id-update"
    header="Update Announcement"
    submit-text="Update"
    show-cancel
    :form="form"
    @success="onSuccessOrCancel"
    @cancel="onSuccessOrCancel">
  </card-form>
</template>

<script>
import CardForm from '@/components/forms/CardForm'

export default {
  layout: 'dashboard',

  async asyncData ({ params, app }) {
    const res = await app.$pybossa.getUpdateAnnouncement(params.id)
    return {
      form: {
        endpoint: `/admin/announcement/${this.res.data.form.id}/update`,
        method: 'post',
        model: res.data.form,
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
            },
            {
              model: 'media_url',
              label: 'URL',
              type: 'input',
              inputType: 'url'
            }
          ]
        }
      }
    }
  },

  head () {
    return {
      title: 'Update Announcement'
    }
  },

  components: {
    CardForm
  },

  methods: {
    /**
     * Handle success or cancel.
     */
    onSuccessOrCancel () {
      this.$router.push({ name: 'admin-announcements' })
      this.$store.dispatch('UPDATE_ANNOUNCEMENTS', this.pybossa)
    }
  }
}
</script>
