<template>
  <pybossa-form
    id="admin-announcement-id-update"
    header="Update Announcement"
    submit-text="Update"
    show-cancel
    :form="form"
    @success="onSuccessOrCancel"
    @cancel="onSuccessOrCancel">
  </pybossa-form>
</template>

<script>
import pybossa from '@/api/pybossa'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'dashboards/admin',

  async asyncData ({ params }) {
    const res = await pybossa.getUpdateAnnouncement(params.id)
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
    PybossaForm
  },

  methods: {
    /**
     * Handle success or cancel.
     */
    onSuccessOrCancel () {
      this.$router.push({ name: 'admin-announcements' })
      this.$store.dispatch('UPDATE_ANNOUNCEMENTS')
    }
  }
}
</script>
