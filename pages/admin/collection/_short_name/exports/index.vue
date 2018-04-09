<template>
  <card-base :title="title" :description="description">
    <div class="float-md-right" slot="controls">
      <b-btn
        variant="success"
        class="my-1"
        size="sm"
        :to="{
          name: 'admin-collection-short_name-exports-new',
          params: {
            short_name: this.collection.short_name
          }
        }">
        New
      </b-btn>
    </div>

    <b-table
      ref="table"
      responsive
      striped
      hover
      show-empty
      :dark="darkMode"
      class="border-left-0 border-right-0 border-bottom-0"
      :items="collection.info.export_formats"
      :fields="tableFields">
      <template slot="fields" slot-scope="exportFormat">
        {{ exportFormat.item.fields.length }}
      </template>
      <template slot="actions" slot-scope="exportFormat">
        <b-btn
          variant="success"
          size="sm"
          :to="{
            name: 'admin-collection-short_name-exports-id',
            params: {
              id: exportFormat.item.id
            }
          }">
          Edit
        </b-btn>
        <b-btn
          variant="warning"
          size="sm"
          @click="deleteExport(exportFormat.item.id)">
          Remove
        </b-btn>
      </template>
    </b-table>

  </card-base>
</template>

<script>
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, metaTags ],

  data () {
    return {
      title: 'Exports',
      description: `Manage the collection's custom export formats.`,
      tableFields: {
        name: {
          label: 'Name',
          sortable: true
        },
        fields: {
          label: 'Exported Fields',
          class: 'text-center',
          sortable: true
        },
        actions: {
          label: 'Actions',
          class: 'text-center'
        }
      }
    }
  },

  asyncData ({ params, app, error }) {
    const endpoint = `/lc/categories/${params.short_name}/exports`
    return app.$axios.$get(endpoint).then(data => {
      return {
        volumes: data.exports
      }
    })
  },

  components: {
    CardBase
  },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    }
  },

  methods: {
    /**
     * Delete an export.
     * @param {String} id
     *   The export ID.
     */
    deleteExport (id) {
      const endpoint = `/api/category/${this.collection.id}`
      const exportFormats = this.collection.info.export_formats
      const infoClone = JSON.parse(JSON.stringify(this.collection.info))
      infoClone.export_formats = exportFormats.filter(expt => {
        return expt.id !== id
      })
      this.$swal({
        title: `Delete Export Format`,
        text: `Are you sure you want to delete this export format?`,
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this.$axios.$put(endpoint, { info: infoClone })
        }
      }).then(data => {
        if (data) {
          this.$notifications.success({
            message: 'Export format deleted'
          })
          this.$store.dispatch('UPDATE_CURRENT_COLLECTION', data)
        }
      }).catch(err => {
        if (typeof err === 'object' && err.hasOwnProperty('dismiss')) {
          this.$nuxt.error(err)
        }
      })
    }
  }
}
</script>
