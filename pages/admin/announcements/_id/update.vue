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
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'admin-dashboard',

  async asyncData ({ params, app, error }) {
    const endpoint = `/admin/announcement/${params.id}/update`
    return app.$axios.$get(endpoint).then(data => {
      return {
        form: {
          endpoint: `/admin/announcement/${params.id}/update`,
          method: 'post',
          model: data.form,
          schema: {
            fields: [
              {
                model: 'title',
                label: 'Content',
                type: 'textArea',
                rows: 3,
                placeholder: 'Write an announcement (use Markdown)'
              },
              {
                model: 'body',
                label: 'URL',
                type: 'input',
                inputType: 'text',
                placeholder: 'http://example.com'
              }
            ]
          }
        }
      }
    }).catch(err => {
      error({ statusCode: err.statusCode, message: err.message })
    })
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
      this.$store.dispatch('UPDATE_ANNOUNCEMENTS', this.$axios)
    }
  }
}
</script>
