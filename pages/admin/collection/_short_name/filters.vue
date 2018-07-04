<template>
  <div>
    <card-base
      :title="title"
      :description="description"
      docs="/celebrations/filters/">

      <b-btn
        slot="controls"
        class="float-md-right"
        size="sm"
        variant="success"
        v-b-modal="addProjectFilterModalId">
        Add a filter
      </b-btn>

      <p slot="guidance">
        Tags are used to help users more easily location the types of project
        that they're interested in. The available tag types for all projects
        within a collection are managed via this section.
      </p>

      <b-table
        ref="table"
        responsive
        striped
        hover
        show-empty
        :dark="darkMode"
        class="border-left-0 border-right-0 border-bottom-0"
        :items="currentCollection.info.project_filters"
        :fields="tableFields">
        <template slot="color" slot-scope="row">
          <div
            :style="`background-color: ${row.item.color};`"
            class="p-1 text-white">
            <strong>{{ row.item.color }}</strong>
          </div>
        </template>
        <template slot="actions" slot-scope="row">
          <b-btn
            variant="warning"
            size="sm"
            @click="removeProjectFilter(row.item)">
            Remove
          </b-btn>
        </template>
      </b-table>

    </card-base>

    <add-project-filter-modal
      lazy
      :collection="currentCollection"
      :modal-id="addProjectFilterModalId"
      @update="refresh">
    </add-project-filter-modal>

  </div>
</template>

<script>
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { metaTags } from '@/mixins/metaTags'
import AddProjectFilterModal from '@/components/modals/AddProjectFilter'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, metaTags ],

  data () {
    return {
      title: 'Project Filters',
      description: 'Manage the available filters for project on the ' +
        'microsite.',
      addProjectFilterModalId: 'add-project-filter-modal',
      tableFields: {
        name: {
          label: 'Type',
          sortable: true
        },
        color: {
          label: 'Colour',
          class: 'text-center d-none d-sm-table-cell'
        },
        actions: {
          label: 'Actions',
          class: 'text-center'
        }
      }
    }
  },

  components: {
    AddProjectFilterModal,
    CardBase
  },

  computed: {
    currentCollection () {
      return this.$store.state.currentCollection
    }
  },

  methods: {
    /**
     * Show the remove project filter alert.
     * @param {Object} filter
     *   The project filter.
     */
    removeProjectFilter (filter) {
      this.$swal({
        title: `Delete Project Filter`,
        text: `Are you sure you want to delete the "${filter.name}" filter?`,
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          const endpoint = `/api/category/${this.currentCollection.id}`
          let infoClone = Object.assign({}, this.currentCollection.info)
          infoClone.project_filters = infoClone.project_filters.filter(f => {
            return f !== filter
          })

          return this.$axios.$put(endpoint, {
            info: infoClone
          }).then(data => {
            this.currentCollection.info = infoClone
          })
        }
      }).then(result => {
        if (result) {
          this.$notifications.success({ message: `Project Filter deleted` })
          this.refresh()
        }
      }).catch(err => {
        if (typeof err === 'object' && err.hasOwnProperty('dismiss')) {
          this.$nuxt.error(err)
        }
      })
    },

    /**
     * Handle a project filter being updated.
     */
    refresh () {
      this.$refs.table.refresh()
    }
  }
}
</script>
