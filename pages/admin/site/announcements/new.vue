<template>
  <b-card no-body>
    <div slot="header" class="mb-0">
      <span>
        <h6 class="mb-0">{{ title }}</h6>
        <p class="text-muted mb-0">
          <small>
            A thumbnail image can be added and the announcement published on
            the next page.
          </small>
        </p>
      </span>
    </div>
    <pybossa-form
      id="admin-announcement-new"
      show-cancel
      :form="form"
      no-border
      @success="onSuccess"
      @cancel="onCancel">
    </pybossa-form>
  </b-card>
</template>

<script>
import { notifications } from '@/mixins/notifications'
import VueFormGenerator from 'vue-form-generator'
import ImageUploadForm from '@/components/forms/ImageUpload'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'admin-site-dashboard',

  mixins: [ notifications ],

  data () {
    return {
      title: 'New Announcement',
      form: {
        endpoint: '/api/announcement',
        method: 'post',
        model: {
          title: null,
          body: null,
          published: false
        },
        schema: {
          fields: [
            {
              model: 'title',
              label: 'Content',
              type: 'textArea',
              rows: 3,
              placeholder: 'Write an announcement using Markdown ' +
                '(a couple of lines works best)',
              required: true,
              validator: VueFormGenerator.validators.string
            },
            {
              model: 'body',
              label: 'URL',
              type: 'input',
              inputType: 'text',
              placeholder: 'http://example.com',
              required: true,
              validator: VueFormGenerator.validators.string
            }
          ]
        }
      }
    }
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
     * Handle success.
     * @param {Object} data
     *   The response data.
     */
    onSuccess (data) {
      this.notify({
        type: 'success',
        title: 'Success',
        message: 'Announcement created'
      })
      this.$router.push({
        name: 'admin-site-announcements-id-update',
        params: {
          id: data.id
        }
      })
    },

    /**
     * Handle cancel.
     */
    onCancel () {
      this.$router.push({ name: 'admin-site-announcements' })
    }
  }
}
</script>
