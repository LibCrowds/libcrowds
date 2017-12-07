<template>
  <card-base :title="title" :description="description">
    <form-base
      show-cancel
      class="pybossa-form"
      :processing="processing"
      @submit="uploadCsv">
      <p>
        Each volume is tracked as a name against a URI that will provide the
        resources for a project (or multiple projects). This makes project
        generation easier and helps with the aggregation of results. Volumes
        details can be uploaded in bulk using the CSV file selector below.
      </p>
      <p>
        This collection is currently set to use the
        <strong>{{ collection.info.presenter }}</strong> task presenter.
        The CSV file should have no header row and must contain the following
        columns (in this order):
      </p>
      <ol v-if="collection.info">
        <li
          v-for="(item, index) in importerFields[collection.info.presenter]"
          :key="index">
          {{ item }}
        </li>
      </ol>
      <vue-form-generator
        ref="form"
        :schema="form.schema"
        :model="form.model">
      </vue-form-generator>
    </form-base>
  </card-base>
</template>

<script>
import shorthash from 'shorthash'
import Papa from 'papaparse'
import uniq from 'lodash/uniq'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { notifications } from '@/mixins/notifications'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import FormBase from '@/components/forms/Base'
import TemplateForm from '@/components/forms/Template'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, notifications, metaTags ],

  data () {
    return {
      title: 'Upload Volumes',
      description: 'Upload a CSV containing volumes for the collection.',
      processing: false,
      importerFields: {
        z3950: [
          'Name',
          'Flickr Album URI'
        ],
        'iiif-annotation': [
          'Name',
          'Manifest URI'
        ]
      }
    }
  },

  components: {
    CardBase,
    FormBase,
    TemplateForm
  },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    },

    form () {
      return {
        model: {
          'file': null
        },
        schema: {
          fields: [
            {
              model: 'file',
              label: 'CSV File',
              type: 'upload',
              placeholder: 'Choose a CSV file...',
              accept: 'text/csv',
              required: true,
              onChanged: (model, schema, event) => {
                model.file = event.target.files[0]
              },
              validator: value => {
                if (!value) {
                  return 'The CSV file is required'
                }
              }
            }
          ]
        }
      }
    }
  },

  methods: {
    /**
     * Upload a CSV.
     */
    uploadCsv () {
      if (!this.$refs.form.validate()) {
        this.notifyInvalidForm()
        return
      }

      const reader = new FileReader()
      reader.onload = (evt) => {
        const csv = Papa.parse(evt.target.result)
        this.processCsv(csv.data)
      }
      if (this.form.model.file) {
        reader.readAsText(this.form.model.file)
      }
    },

    /**
     * Process the CSV.
     * @param {Object} data
     *   The data.
     */
    processCsv (data) {
      this.processing = true
      const infoClone = Object.assign({}, this.collection.info)
      const newVolumes = data.map(row => {
        return {
          name: row[0],
          source: row[1]
        }
      })

      if (!this.validateSources(newVolumes)) {
        this.processing = false
        return
      }

      infoClone.volumes = {}
      for (let vol of newVolumes) {
        infoClone.volumes[shorthash.unique(vol.source)] = vol
      }

      return this.$axios.$put(`/api/category/${this.collection.id}`, {
        info: infoClone
      }).then(result => {
        if (result) {
          this.goBack()
          this.collection.info = infoClone
          this.notifySuccess({ message: `Volumes updated` })
        }
        this.processing = false
      })
    },

    /**
     * Check for duplicate sources.
     * @param {Array} volumes
     *   The list of volumes.
     */
    validateSources (volumes) {
      const sources = volumes.map(vol => vol.source)
      console.log(sources)
      if (uniq(sources).length !== sources.length) {
        this.$swal({
          title: 'Duplicate Sources',
          text: `The CSV file contains duplicate sources, please correct
            these before resubmitting.`,
          type: 'warning'
        })
        return false
      } else if (!sources.every(s => /^(|http|https):\/\/[^ "]+$/.test(s))) {
        this.$swal({
          title: 'Invalid Sources',
          text: `The CSV file seems to contain invalid URI sources. This could
            indicate a file that contains empty rows. Please confirm that all
            values in the second column are valid URIs before resubmitting.`,
          type: 'warning'
        })
        return false
      }
      return true
    },

    /**
     * Go back.
     */
    goBack () {
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
