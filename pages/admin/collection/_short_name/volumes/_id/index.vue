<template>
  <card-base :title="title" :description="description">
    <b-tabs card>
      <b-tab title="Details" active no-body>
        <pybossa-form
          submit-text="Update Details"
          cancel-text="Back"
          show-cancel
          :form="form"
          @cancel="onCancel">
        </pybossa-form>
      </b-tab>
      <b-tab title="Thumbnail" no-body>
        <image-upload-form
          submit-text="Update Thumbnail"
          cancel-text="Back"
          show-cancel
          file-field="avatar"
          crop-type="square"
          :endpoint="thumbnailForm.endpoint"
          :model="thumbnailForm.model"
          :method="thumbnailForm.method"
          :current-image-url="currentImageUrl"
          @cancel="onCancel">
        </image-upload-form>
      </b-tab>
    </b-tabs>
  </card-base>
</template>

<script>
import localConfig from '@/local.config'
import { metaTags } from '@/mixins/metaTags'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { getShortname } from '@/mixins/getShortname'
import ImageUploadForm from '@/components/forms/ImageUpload'
import PybossaForm from '@/components/forms/PybossaForm'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, metaTags, getShortname ],

  data () {
    return {
      title: 'Update Volume',
      description: 'Update the volume details and thumbnail.'
    }
  },

  asyncData ({ params, app, error }) {
    const endpoint = `/lc/categories/${params.short_name}/volumes` +
      `/${params.id}/update?response_format=json`
    return app.$axios.$get(endpoint).then(data => {
      data.upload_form.btn = 'Upload'
      delete data.upload_form.id
      return {
        volume: data.volume,
        endpoint: endpoint,
        formData: data.form,
        thumbnailForm: {
          endpoint: endpoint,
          method: 'POST',
          model: data.upload_form
        }
      }
    }).catch(err => {
      error(err)
    })
  },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    },

    form () {
      return {
        endpoint: this.endpoint,
        method: 'post',
        model: this.formData,
        schema: {
          fields: [
            {
              model: 'name',
              label: 'Name',
              type: 'input',
              inputType: 'text',
              placeholder: 'A name for the volume',
              onChanged: (model, newVal, oldVal, field) => {
                const newSn = this.getShortname(newVal)
                const oldSn = this.getShortname(oldVal)
                if (!model.short_name || model.short_name === oldSn) {
                  model.short_name = newSn
                }
              }
            },
            {
              model: 'short_name',
              label: 'Short Name',
              type: 'input',
              inputType: 'text',
              placeholder: 'A short name for the volume',
              hint: 'The short name is used in the file names of any ' +
                'custom, volume-level downloads.'
            },
            {
              model: 'source',
              label: 'Source',
              type: 'input',
              inputType: 'url',
              placeholder: `The input source URI`,
              validator: (value) => {
                const presenter = this.collection.info['presenter']
                const source = value ? value.trim() : null
                if (!source) {
                  return 'This field is required!'
                } else if (
                  presenter === 'iiif-annotation' &&
                  !source.match(/^(https?:\/\/).*\/manifest\.json$/g)
                ) {
                  return 'Not a valid IIIF manifest URI'
                } else if (
                  presenter === 'z3950' &&
                  !source.match(/www.flickr.com\/.+\/albums\/\d+$/g)
                ) {
                  return 'Not a valid Flickr album URI'
                }
              },
              hint: () => {
                const presenter = this.collection.info['presenter']
                if (presenter === 'iiif-annotation') {
                  return 'This should be a valid IIIF manifest URI.'
                } else if (presenter === 'z3950') {
                  return 'This should be a valid Flickr album URI.'
                }
              }
            }
          ]
        }
      }
    },

    currentImageUrl () {
      const thumbnailUrl = this.volume.thumbnail_url
      if (typeof thumbnailUrl === 'undefined' || thumbnailUrl === null) {
        return ''
      } else if (thumbnailUrl.startsWith('/uploads') > -1) {
        return localConfig.pybossaHost + thumbnailUrl
      }
      return thumbnailUrl
    }
  },

  components: {
    PybossaForm,
    ImageUploadForm,
    CardBase
  },

  methods: {
    /**
     * Handle cancel.
     */
    onCancel () {
      this.$router.push({
        name: 'admin-collection-short_name-volumes',
        params: {
          short_name: this.collection.short_name
        }
      })
    }
  }
}
</script>
