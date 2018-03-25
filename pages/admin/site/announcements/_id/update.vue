<template>
  <card-base :title="title" :description="description">
    <div slot="controls" class="d-flex align-items-center float-right">
      <label class="mr-1 mb-0 toggle-label">
        <strong>Published</strong>
      </label>
      <no-ssr>
        <toggle-button
          :value="form.model.published"
          :sync="true"
          :labels="true"
          class="mb-0"
          @change="togglePublished">
        </toggle-button>
      </no-ssr>
    </div>

    <b-tabs card>
      <b-tab title="Core Details" active no-body>
        <pybossa-form
          submit-text="Update"
          show-cancel
          :form="form"
          @cancel="onCancel">
        </pybossa-form>
      </b-tab>
      <b-tab title="Thumbnail" no-body>
        <image-upload-form
          submit-text="Update"
          :endpoint="thumbnailForm.endpoint"
          :model="thumbnailForm.model"
          :method="thumbnailForm.method"
          :current-image-url="currentImageUrl"
          file-field="file">
        </image-upload-form>
      </b-tab>
    </b-tabs>
  </card-base>
</template>

<script>
import localConfig from '@/local.config'
import pick from 'lodash/pick'
import { metaTags } from '@/mixins/metaTags'
import ImageUploadForm from '@/components/forms/ImageUpload'
import PybossaForm from '@/components/forms/PybossaForm'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-site-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'Update Announcement',
      description: 'Update and publish the announcement.'
    }
  },

  async asyncData ({ params, app, error }) {
    const endpoint = `/api/announcement/${params.id}`
    return app.$axios.$get(endpoint).then(data => {
      return {
        announcement: data,
        form: {
          endpoint: `/api/announcement/${data.id}`,
          method: 'PUT',
          model: pick(
            data,
            'title',
            'body',
            'published',
            'info'
          ),
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
                label: 'Content',
                type: 'input',
                inputType: 'text'
              },
              {
                model: 'info.url',
                label: 'URL',
                type: 'input',
                inputType: 'url'
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
      error(err)
    })
  },

  components: {
    PybossaForm,
    ImageUploadForm,
    CardBase
  },

  computed: {
    currentImageUrl () {
      const thumbnailUrl = this.announcement.media_url
      if (typeof thumbnailUrl === 'undefined' || thumbnailUrl === null) {
        return ''
      } else if (thumbnailUrl.startsWith('/uploads')) {
        return localConfig.pybossaHost + thumbnailUrl
      }
      return thumbnailUrl
    }
  },

  methods: {
    /**
     * Handle cancel.
     */
    onCancel () {
      this.$router.push({ name: 'admin-site-announcements' })
    },

    /**
     * Publish or unpublish an announcement.
     * @param {Object} project
     *   The project.
     */
    togglePublished () {
      this.$axios.$put(`/api/announcement/${this.announcement.id}`, {
        published: !this.form.model.published
      }).then(data => {
        this.form.model.published = !this.form.model.published
        this.$notifications.success({
          message: this.form.model.published
            ? 'Announcement published'
            : 'Announcement unpublished'
        })
      }).catch(err => {
        this.$nuxt.error(err)
      })
    }
  }
}
</script>
