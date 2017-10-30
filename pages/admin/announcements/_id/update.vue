<template>
  <b-card
    id="admin-announcements-update"
    no-body>

    <div
      slot="header"
      class="mb-0 d-flex align-items-center justify-content-between">
      <span>
        <h6 class="mb-0">{{ title }}</h6>
        <p class="text-muted mb-0">
          <small>
            Edit and publish the announcement.
          </small>
        </p>
      </span>
      <div class="d-flex align-items-center">
        <label class="mr-1 mb-0 toggle-label">
          <strong>Published</strong>
        </label>
        <toggle-button
          :value="form.model.published"
          :sync="true"
          :labels="true"
          class="mb-0"
          @change="togglePublished">
        </toggle-button>
      </div>
    </div>

    <b-tabs ref="tabs" no-body card>
      <b-tab title="Core Details" active>
        <pybossa-form
          submit-text="Update"
          show-cancel
          no-border
          :form="form"
          @cancel="onCancel">
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
import { notifications } from '@/mixins/notifications'
import ImageUploadForm from '@/components/forms/ImageUpload'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'admin-dashboard',

  mixins: [ notifications ],

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
     * Handle cancel.
     */
    onCancel () {
      this.$router.push({ name: 'admin-announcements' })
    },

    /**
     * Publish or unpublish an announcement.
     * @param {Object} project
     *   The project.
     */
    togglePublished () {
      this.$axios.$put(`/api/announcement/${this.form.model.id}`, {
        published: !this.form.model.published
      }).then(data => {
        this.form.model.published = !this.form.model.published
        this.notify({
          type: 'success',
          title: 'Success',
          message: this.form.model.published
            ? 'Announcement published'
            : 'Announcement unpublished'
        })
      }).catch(err => {
        this.$nuxt.error({ statusCode: err.statusCode, message: err.message })
      })
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
