<template>
  <b-card
    id="admin-announcements-update"
    no-body
    :header="title">
    <b-tabs ref="tabs" no-body card>
      <b-tab title="Core Details" active>
        <pybossa-form
          submit-text="Update"
          show-cancel
          no-border
          :form="form"
          @success="onSuccessOrCancel"
          @cancel="onSuccessOrCancel">
        </pybossa-form>
      </b-tab>
      <b-tab title="Thumbnail">
        <image-upload-form
          submit-text="Update"
          :endpoint="thumbnailForm.endpoint"
          :model="thumbnailForm.model"
          :method="thumbnailForm.method"
          file-field="file"
          method="PUT">
        </image-upload-form>
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
import ImageUploadForm from '@/components/forms/ImageUpload'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'admin-dashboard',

  data () {
    return {
      title: 'Update Announcement'
    }
  },

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
        },
        thumbnailForm: {
          endpoint: `/api/announcement/${params.id}`,
          method: 'PUT',
          model: {
            file: null,
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0
          }
        }
      }
    }).catch(err => {
      error({ statusCode: err.statusCode, message: err.message })
    })
  },

  head () {
    return {
      title: this.title
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

<style lang="scss">
#admin-announcements-update {
  .tab-content.card-body {
    padding: 0;
  }
}
</style>
