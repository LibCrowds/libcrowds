<template>
  <b-card no-body>
    <div
      slot="header"
      class="mb-0 d-flex align-items-center justify-content-between">
      <span>
        <h6 class="mb-0">{{ title }}</h6>
        <p class="text-muted mb-0">
          <small>
            Manage the collection microsites.
          </small>
        </p>
      </span>
      <b-btn
        variant="success"
        size="sm"
        :to="{
          name: 'admin-collection-new'
        }">
        New
      </b-btn>
    </div>

    <b-card-body class="p-0">
      <b-table
        hover
        show-empty
        :items="collections"
        :fields="table.fields">

        <template slot="n_projects" scope="collection">
          {{ nProjects[collection.item.short_name] }}
        </template>

        <template slot="created" scope="collection">
          {{ collection.item.created | moment('calendar') }}
        </template>

        <template slot="action" scope="collection">
          <b-btn
            variant="success"
            size="sm"
            block
            exact
            :to="{
              name: 'admin-collection-short_name-settings',
              params: {
                short_name: collection.item.short_name
              }
            }">
            Open
          </b-btn>
        </template>

      </b-table>
    </b-card-body>
  </b-card>
</template>

<script>
import { deleteDomainObject } from '@/mixins/deleteDomainObject'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ deleteDomainObject ],

  data () {
    return {
      title: 'Open Collection',
      table: {
        fields: {
          name: {
            label: 'Name'
          },
          n_projects: {
            label: 'Projects',
            class: 'text-center d-none d-md-table-cell',
            sortable: true
          },
          created: {
            label: 'Created',
            class: 'text-center d-none d-md-table-cell',
            sortable: true
          },
          action: {
            label: 'Action',
            class: 'text-center'
          }
        }
      }
    }
  },

  async asyncData ({ app, error }) {
    const endpoint = `/admin/categories`
    return app.$axios.$get(endpoint).then(data => {
      return {
        collections: data.categories,
        nProjects: data.n_projects_per_category
      }
    }).catch(err => {
      error(err)
    })
  },

  head () {
    return {
      title: this.title
    }
  },

  components: {
    PybossaForm
  },

  methods: {
    /**
     * Delete a collection.
     * @param {Number|String} id
     *   The collection ID.
     */
    deleteCollection (id) {
      this.deleteDomainObject('category', id, () => {
        this.collections = this.collections.filter(collection => {
          return collection.id !== id
        })
      })
    }
  },

  beforeMount () {
    this.$store.dispatch('UPDATE_CURRENT_COLLECTION', {})
  }
}
</script>
