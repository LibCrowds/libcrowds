<template>
  <card-base :title="title" help="Manage the collection microsites">
    <b-btn
      slot="controls"
      variant="success"
      class="float-right"
      size="sm"
      :to="{
        name: 'admin-collection-new'
      }">
      New
    </b-btn>

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
  </card-base>
</template>

<script>
import PybossaForm from '@/components/forms/PybossaForm'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-collection-dashboard',

  middleware: 'is-admin',

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
    PybossaForm,
    CardBase
  },

  beforeMount () {
    this.$store.dispatch('UPDATE_CURRENT_COLLECTION', {})
  }
}
</script>
