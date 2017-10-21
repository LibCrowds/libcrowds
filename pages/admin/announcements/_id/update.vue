<template>
  <pybossa-form
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
  layout: 'admin-dashboard',

  async asyncData ({ params }) {
    const res = await pybossa.getUpdateAnnouncement(params.id)
    return {
      form: {
        endpoint: `/admin/announcement/${params.id}/update`,
        method: 'post',
        model: res.data.form,
        schema: {
          fields: [
            {
              model: 'title',
              label: 'Announcement',
              type: 'textArea',
              rows: 3,
              placeholder: 'Use Markdown'
            },
            {
              model: 'body',
              label: 'Link URL',
              type: 'input',
              inputType: 'text'
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
