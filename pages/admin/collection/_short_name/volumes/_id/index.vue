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
      <b-tab title="Tasks" no-body>
        <pybossa-form
          submit-text="Update Task Data"
          cancel-text="Back"
          form-key="import_form"
          show-cancel
          :form="importForm"
          @cancel="onCancel"
          @success="onImportFormSuccess">
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
      data.import_form.btn = 'Import'
      delete data.upload_form.id
      return {
        importers: data.all_importers,
        volume: data.volume,
        endpoint: endpoint,
        formModel: data.form,
        importFormModel: data.import_form,
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
      const validImporters = [
        'iiif',
        'flickr',
        'gdocs'
      ]

      return {
        endpoint: this.endpoint,
        method: 'post',
        model: this.formModel,
        schema: {
          fields: [
            {
              model: 'name',
              label: 'Name',
              type: 'input',
              inputType: 'text',
              onChanged: (model, newVal, oldVal, field) => {
                const newSn = this.getShortname(newVal)
                const oldSn = this.getShortname(oldVal)
                if (!model.short_name || model.short_name === oldSn) {
                  model.short_name = newSn
                }
              },
              hint: 'The name of the volume'
            },
            {
              model: 'short_name',
              label: 'Short Name',
              type: 'input',
              inputType: 'text',
              hint: 'An identifier used, for example, in the file names of ' +
                ' volume-level downloads'
            },
            {
              type: 'select',
              label: 'Importer',
              model: 'importer',
              required: true,
              values: () => this.importers.filter(importer => {
                return validImporters.indexOf(importer) > -1
              }).map(importer => {
                return { id: importer, name: importer }
              }),
              selectOptions: {
                hideNoneSelected: true
              },
              hint: 'The importer type'
            }
          ]
        }
      }
    },

    importForm () {
      // We only implement those types where the tasks will be imported with
      // link, url, url_b and url_m fields, so that we can be consistent with
      // generic ways of handling that data
      const importerFields = {
        iiif: [
          {
            model: 'manifest_uri',
            label: 'Manifest URI',
            type: 'input',
            inputType: 'text',
            hint: 'A IIIF manifest URI'
          }
        ],
        flickr: [
          {
            model: 'album_id',
            label: 'Album ID',
            type: 'input',
            inputType: 'text',
            hint: 'A Flickr album ID'
          }
        ],
        gdocs: [
          {
            model: 'googledocs_url',
            label: 'Google Spreadsheet URL',
            type: 'input',
            inputType: 'text',
            placeholder: 'https://docs.google.com/spreadsheets/d/key/edit' +
              '?usp=sharing',
            hint: 'A shareable Google Docs spreadsheet URL'
          }
        ]
        // TODO: Add S3, dropbox and maybe csv/gdocs
      }

      return {
        endpoint: this.endpoint,
        method: 'post',
        model: this.importFormModel,
        schema: {
          fields: importerFields[this.volume.importer]
        }
      }
    },

    currentImageUrl () {
      const thumbnailUrl = this.volume.thumbnail_url
      if (typeof thumbnailUrl === 'undefined' || thumbnailUrl === null) {
        return ''
      } else if (thumbnailUrl.startsWith('/uploads')) {
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
    },

    /**
     * Handle import form success.
     * @param {Object} data
     *   The returned data.
     */
    onImportFormSuccess (data) {
      this.volume = data.volume
    }
  }
}
</script>
