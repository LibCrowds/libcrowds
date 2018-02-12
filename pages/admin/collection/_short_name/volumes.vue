<template>
  <card-base :title="title" :description="description">
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
      :dark="darkMode"
      :items="collection.info.volumes"
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
    </upload-csv-modal>

  </card-base>
</template>

<script>
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
      }
    }
  },

  components: {
    CardBase,
    UploadCsvModal
  },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    }
  },

  methods: {
    /**
     * Handle submission of the CSV modal.
     * @param {Object} data
     *   The data.
     */
    onCsvSubmit (data) {
      let infoClone = Object.assign({}, this.collection.info)
      infoClone.volumes = data.map(row => {
        return {
          name: row[0],
          source: row[1]
        }
      })
      this.$swal({
        title: 'Update Volumes',
        text: 'Are you sure you want to overwrite the current list of volumes?',
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
          this.notifySuccess({ message: `Volumes updated` })
        }
      })
    }
  }
}
</script>
