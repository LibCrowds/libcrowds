<template>
  <card-base :title="title" :description="description">

    <b-alert show variant="info" v-if="hasProjects">
      As projects have already been built from this volume certain fields
      are disabled and cannot be updated. This is because doing so would
      risk breaking functions that rely on consistent volume data, such as
      results aggregation.
    </b-alert>

    <b-tabs card>
      <b-tab title="Details" active no-body>
        <pybossa-form
          submit-text="Update Details"
          cancel-text="Back"
          show-cancel
          :show-submit="!hasProjects"
          :form="form"
          @cancel="onCancel"
          @success="onSuccess">
        </pybossa-form>
      </b-tab>
      <b-tab title="Import Souce" no-body>
        <pybossa-form
          submit-text="Update Import Source"
          cancel-text="Back"
          form-key="import_form"
          show-cancel
          :show-submit="!hasProjects"
          :form="importForm"
          @cancel="onCancel"
          @success="onSuccess">
        </pybossa-form>
      </b-tab>
      <b-tab
        title="IIIF Settings"
        no-body
        :disabled="formModel.importer !== 'iiif'">
        <pybossa-form
          submit-text="Update IIIF Settings"
          cancel-text="Back"
          form-key="iiif_form"
          show-cancel
          :form="iiifForm"
          @cancel="onCancel"
          @success="onSuccess">
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
          @cancel="onCancel"
          @success="onSuccess">
        </image-upload-form>
      </b-tab>
    </b-tabs>
  </card-base>
</template>

<script>
import VueFormGenerator from 'vue-form-generator'
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
    return app.$axios.$get(endpoint).then((data) => {
      data.upload_form.btn = 'Upload'
      data.import_form.btn = 'Import'
      data.iiif_form.btn = 'IIIF'

      delete data.upload_form.id

      return {
        hasProjects: data.has_projects,
        importers: data.all_importers,
        volume: data.volume,
        endpoint: endpoint,
        formModel: data.form,
        importFormModel: data.import_form,
        iiifFormModel: data.iiif_form,
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
              hint: 'The name of the volume',
              disabled: this.hasProjects
            },
            {
              model: 'short_name',
              label: 'Short Name',
              type: 'input',
              inputType: 'text',
              hint: 'An identifier used, for example, in the file names of ' +
                ' volume-level downloads',
              disabled: this.hasProjects
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
                hideNoneSelectedText: true
              },
              hint: 'The importer type',
              disabled: this.hasProjects
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
            placeholder: 'https://host/prefix/identifier/manifest.json',
            hint: 'A IIIF manifest URI',
            disabled: this.hasProjects
          }
        ],
        flickr: [
          {
            model: 'album_id',
            label: 'Album ID',
            type: 'input',
            inputType: 'text',
            hint: 'A Flickr album ID',
            disabled: this.hasProjects
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
            hint: 'A shareable Google Docs spreadsheet URL',
            disabled: this.hasProjects
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

    iiifForm () {
      return {
        endpoint: this.endpoint,
        method: 'post',
        model: this.iiifFormModel,
        schema: {
          fields: [
            {
              type: 'input',
              label: 'Image API',
              model: 'image_api_uri',
              placeholder: 'http://example.org/images',
              validator: VueFormGenerator.validators.url,
              hint: 'Optional base URI for the IIIF Image API service; used ' +
                'to generate custom manifests, such as from user tags.'
            },
            {
              type: 'input',
              label: 'Image API',
              model: 'image_api_version',
              placeholder: '2.0',
              validator: VueFormGenerator.validators.double,
              hint: 'The versionl of the above IIIF Image API.'
            },
            {
              type: 'input',
              label: 'Image API',
              model: 'image_api_compliance_level',
              placeholder: 'http://example.org/images',
              validator: VueFormGenerator.validators.integer,
              hint: 'The compliance level of the above IIIF Image API.'
            }
          ]
        }
      }
    },

    currentImageUrl () {
      const thumbnailUrl = this.volume.thumbnail_url
      if (typeof thumbnailUrl === 'undefined' || thumbnailUrl === null) {
        return ''
      } else if (thumbnailUrl.indexOf('/uploads') === 0) {
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
     * Handle form success.
     * @param {Object} data
     *   The returned data.
     */
    onSuccess (data) {
      this.volume = data.volume
    }
  }
}
</script>
