<template>
  <card-form
    id="admin-announcement-new"
    header="New Announcement"
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

  async asyncData ({ app }) {
    const res = await app.$pybossa.getNewAnnouncement()
    return {
      form: {
        endpoint: '/admin/announcement/new',
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
      title: `New Announcement`
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
      this.$store.dispatch('UPDATE_ANNOUNCEMENTS')
    }
  }
}
</script>
