<template>
  <card-base
    :title="title"
    help="Make an announcement (a thumbnail can be set on the next page)">
    <pybossa-form
      id="admin-announcement-new"
      show-cancel
      :form="form"
      no-border
      @success="onSuccess"
      @cancel="onCancel">
    </pybossa-form>
  </card-base>
</template>

<script>
import pick from 'lodash/pick'
import { notifications } from '@/mixins/notifications'
import VueFormGenerator from 'vue-form-generator'
import ImageUploadForm from '@/components/forms/ImageUpload'
import PybossaForm from '@/components/forms/PybossaForm'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-site-dashboard',

  mixins: [ notifications ],

  middleware: 'is-admin',

  data () {
    return {
      title: 'New Announcement',
      form: {
        endpoint: '/api/announcement',
        method: 'post',
        model: pick(
          'title',
          'body',
          'info'
        ),
        schema: {
          fields: [
            {
              model: 'title',
              label: 'Title',
              type: 'input',
              inputType: 'text',
              placeholder: 'Short titles work best (e.g. New Project Added!)',
              required: true,
              validator: VueFormGenerator.validators.string
            },
            {
              model: 'body',
              label: 'Content',
              type: 'input',
              inputType: 'text',
              placeholder: 'Add some additional details',
              required: true,
              validator: VueFormGenerator.validators.string
            },
            {
              model: 'info.url',
              label: 'URL',
              type: 'input',
              inputType: 'url',
              required: true,
              placeholder: 'http://example.com',
              validator: VueFormGenerator.validators.url
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
    ImageUploadForm,
    CardBase
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
