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
import ImageUploadForm from '@/components/forms/ImageUpload'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'admin-dashboard',

  async asyncData ({ app, error }) {
    const endpoint = `/admin/announcement/new`
    return app.$axios.$get(endpoint).then(data => {
      return {
        form: {
          endpoint: '/admin/announcement/new',
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
      title: `New Announcement`
    }
  },

  components: {
    PybossaForm,
    ImageUploadForm
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
