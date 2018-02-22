<template>
  <card-base :title="title" :description="description">

    <b-form slot="controls" :class="darkMode ? 'form-dark' : null">
      <b-form-input
        v-model="filter"
        class="search-control"
        size="sm"
        :placeholder="`Type to search by ${filterBy}`">
      </b-form-input>
    </b-form>

    <b-tabs card @input="onTabChange">
      <b-tab
        no-body
        v-for="(collection, index) in collections"
        :title="collection.name"
        :key="collection.id">

        <!-- Don't use project-table as we need access to owner details -->
        <infinite-loading-table
          :ref="`table-${index}`"
          :all="currentUser.admin"
          :fields="tableFields"
          :filter="filter"
          :filter-by="filterBy"
          :search-params="{
            category_id: collection.id
          }"
          domain-object="project">
          <template slot="action" scope="project">
            <b-btn
              variant="success"
              size="sm"
              :to="{
                name: 'admin-project-short_name-details',
                params: {
                  short_name: project.item.short_name
                }
              }">
              Open
            </b-btn>
          </template>
        </infinite-loading-table>
      </b-tab>

      <!-- Draft projects -->
      <b-tab
        no-body
        title="Draft"
        key="draft">
        <projects-table
          :ref="`table-${collections.length}`"
          :fields="draftTableFields"
          :filter="filter"
          :filter-by="filterBy"
          :collection="{
            id: 'draft',
            name: 'Draft',
            short_name: 'draft'
          }">
          <template slot="action" scope="project">
            <b-btn
              :disabled="!currentUser.admin"
              variant="success"
              size="sm"
              :to="{
                name: 'admin-project-short_name-details',
                params: {
                  short_name: project.item.short_name
                }
              }">
              {{ currentUser.admin ? 'Open' : 'Pending Approval' }}
            </b-btn>
          </template>
        </projects-table>
      </b-tab>

    </b-tabs>
  </card-base>
</template>

<script>
import { metaTags } from '@/mixins/metaTags'
import InfiniteLoadingTable from '@/components/tables/InfiniteLoading'
import ProjectsTable from '@/components/tables/Projects'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-project-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'Open Project',
      description: 'Manage your projects',
      filter: null,
      filterBy: 'name',
      tableFields: {
        name: {
          label: 'Name',
          sortable: true
        }
      },
      draftTableFields: {
        name: {
          label: 'Name',
          sortable: true
        },
        owner: {
          label: 'Owner',
          class: 'text-center',
          sortable: true
        },
        created: {
          label: 'Created',
          class: 'text-center',
          sortable: true
        }
      }
    }
  },

  components: {
    InfiniteLoadingTable,
    CardBase,
    ProjectsTable
  },

  computed: {
    collections () {
      const published = this.$store.state.publishedCollections
      const collections = JSON.parse(JSON.stringify(published))
      return collections
    },

    currentUser () {
      return this.$store.state.currentUser
    }
  },

  methods: {
    /**
     * Handle tab change.
     * @param {Number} index
     *   The tab index.
     */
    onTabChange (index) {
      this.filter = null
      let table = this.$refs[`table-${index}`]
      if (Array.isArray(table)) {
        table = table[0]
      }
      table.reset()
    }
  },

  beforeMount () {
    this.$store.dispatch('UPDATE_CURRENT_PROJECT', {})
  }
}
</script>
