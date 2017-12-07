<template>
  <card-base :title="title" :description="description">
    <b-btn
      slot="controls"
      variant="warning"
      class="float-right ml-1"
      size="sm"
      @click="deleteAllVolumes">
      Delete All
    </b-btn>
    <b-btn
      slot="controls"
      variant="success"
      class="float-right"
      size="sm"
      v-b-modal="uploadCsvModalId">
      Upload CSV
    </b-btn>

    <b-table
      responsive
      striped
      hover
      show-empty
      class="border-left-0 border-right-0 border-bottom-0"
      :items="Object.values(collection.info.volumes)"
      :fields="fields">
      <template slot="source" scope="volume">
        <a :href="volume.item.source" target="_blank">
          {{ volume.item.source }}
        </a>
      </template>
    </b-table>

    <upload-csv-modal
      :modal-id="uploadCsvModalId"
      @submit="onCsvSubmit">
      <p class="px-2 pt-2">
        The CSV file should have no header row and must contain the following
        columns:
      </p>
      <ol>
        <li><strong>Name:</strong> The name of the volume</li>
        <li><strong>Source:</strong> The source URI</li>
        <li><strong>Importer:</strong>
        The source type ({{ validImportersStr }})</li>
      </ol>
    </upload-csv-modal>

  </card-base>
</template>

<script>
import uniq from 'lodash/uniq'
import shorthash from 'shorthash'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { notifications } from '@/mixins/notifications'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import UploadCsvModal from '@/components/modals/UploadCsv'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, notifications, metaTags ],

  data () {
    return {
      title: 'Volumes',
      description: `Manage the volumes used to generate the microsite's
        projects.`,
      uploadCsvModalId: 'upload-csv-modal',
      fields: {
        name: {
          label: 'Name',
          sortable: true
        },
        source: {
          label: 'Source',
          sortable: true
        }
      },
      validImporters: ['iiif', 's3', 'dropbox', 'flickr']
    }
  },

  components: {
    CardBase,
    UploadCsvModal
  },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    },

    validImportersStr () {
      return this.validImporters.join(', ').replace(/,(?!.*,)/gmi, ' or')
    }
  },

  methods: {
    /**
     * Delete the current list of volumes.
     */
    deleteAllVolumes (data) {
      let infoClone = Object.assign({}, this.collection.info)
      infoClone.volumes = {}
      this.$swal({
        title: 'Delete Volumes',
        text: 'Are you sure you want to delete the current list of volumes?',
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this.$axios.$put(`/api/category/${this.collection.id}`, {
            info: infoClone
          })
        }
      }).then(result => {
        if (result) {
          this.collection.info = infoClone
          this.notifySuccess({ message: `All volumes delete` })
        }
      })
    },

    /**
     * Check for duplicate sources.
     * @param {Array} volumes
     *   The list of volumes.
     */
    validateSources (volumes) {
      const sources = volumes.map(vol => vol.source)
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
          text: `The CSV file seems to contain invalid URI sources, please
            correct these before resubmitting.`,
          type: 'warning'
        })
        return false
      }
      return true
    },

    /**
     * Check that all specified importers are valid.
     * @param {Array} volumes
     *   The list of volumes.
     */
    validateImporters (volumes) {
      const importers = volumes.map(vol => vol.importer)
      const valid = uniq(importers).every((val) => {
        return this.validImporters.indexOf(val) > -1
      })
      if (!valid) {
        this.$swal({
          title: 'Invalid Importers',
          html: `The CSV file contains an invalid importer type.<br>
            The valid types are ${this.validImportersStr}.<br>
            Please correct these before resubmitting the CSV file.`,
          type: 'warning'
        })
        return false
      }
      return true
    },

    /**
     * Handle submission of the CSV modal.
     * @param {Object} data
     *   The data.
     */
    onCsvSubmit (data) {
      let infoClone = Object.assign({}, this.collection.info)
      const newVolumes = data.map(row => {
        return {
          name: row[0],
          source: row[1],
          importer: row[2]
        }
      })

      if (
        !this.validateSources(newVolumes) ||
        !this.validateImporters(newVolumes)
      ) {
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
          this.collection.info = infoClone
          this.notifySuccess({ message: `Volumes updated` })
        }
      })
    }
  }
}
</script>
