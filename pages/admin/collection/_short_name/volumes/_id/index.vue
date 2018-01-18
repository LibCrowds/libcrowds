<template>
  <card-base :title="title" :description="description">
    <b-tabs ref="tabs" card>
      <b-tab title="Details" active no-body>
        <pybossa-form
          submit-text="Update Details"
          show-cancel
          :form="form"
          @cancel="onCancel">
        </pybossa-form>
      </b-tab>
      <b-tab title="Thumbnail" no-body>
        <image-upload-form
          submit-text="Update Thumbnail"
          file-field="avatar"
          crop-type="square"
          :endpoint="thumbnailForm.endpoint"
          :model="thumbnailForm.model"
          :method="thumbnailForm.method">
        </image-upload-form>
      </b-tab>
    </b-tabs>
  </card-base>
</template>

<script>
import { metaTags } from '@/mixins/metaTags'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import ImageUploadForm from '@/components/forms/ImageUpload'
import PybossaForm from '@/components/forms/PybossaForm'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, metaTags ],

  data () {
    return {
      title: 'Update Volume',
      description: 'Update the volume details and thumbnail.'
    }
  },

  async asyncData ({ params, app, error }) {
    const endpoint = `/libcrowds/categories/${params.short_name}/volumes` +
      `/${params.id}/update?response_format=json`
    return app.$axios.$get(endpoint).then(data => {
      data.upload_form.btn = 'Upload'
      delete data.upload_form.id
      return {
        form: {
          endpoint: endpoint,
          method: 'POST',
          model: data.form,
          schema: {
            fields: [
              {
                model: 'name',
                label: 'Name',
                type: 'input',
                inputType: 'text',
                placeholder: 'A name for the volume'
              },
              {
                model: 'source',
                label: 'Source',
                type: 'input',
                inputType: 'url',
                placeholder: `The input source URI`,
                validator: (value) => {
                  const presenter = data.category.info['presenter']
                  const source = value.trim()
                  if (
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
                }
              }
            ]
          }
        },
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
