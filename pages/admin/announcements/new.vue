<template>
  <pybossa-form
    id="admin-announcement-new"
    header="New Announcement"
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

  async asyncData () {
    const res = await pybossa.getNewAnnouncement()
    return {
      form: {
        endpoint: '/admin/announcement/new',
        method: 'post',
        model: res.data.form,
        schema: {
          fields: [
            {
              model: 'title',
              label: 'Content',
              type: 'textArea',
              rows: 3,
              placeholder: 'Use Markdown'
            },
            {
              model: 'body',
              label: 'URL',
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
      title: `New Announcement`
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
