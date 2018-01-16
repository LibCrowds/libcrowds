<template>
  <card-base :title="title" :description="description">
    <b-btn
      slot="controls"
      class="float-md-right"
      size="sm"
      variant="success"
      :to="{
        name: 'account-name-templates-new',
        params: {
          name: currentUser.name
        }
      }">
      New
    </b-btn>

    <b-tabs ref="tabs" no-body card>
      <b-tab
        v-for="collection in publishedCollections"
        :title="collection.name"
        :key="collection.id">
        <b-table
          responsive
          striped
          hover
          show-empty
          class="border-left-0 border-right-0 border-bottom-0"
          :items="getCollectionTemplates(collection.id)"
          :fields="tableFields">
          <template slot="actions" scope="template">
            <b-btn
              variant="success"
              size="sm"
              :to="{
                name: 'account-name-templates-id',
                params: {
                  name: currentUser.name,
                  id: template.item.id
                }
              }">
              Open
            </b-btn>
          </template>
        </b-table>
      </b-tab>
    </b-tabs>
  </card-base>
</template>

<script>
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'templates-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'Project Templates',
      description: 'Create and manage your project templates.',
      tableFields: {
        name: {
          label: 'Name',
          sortable: true
        },
        description: {
          label: 'Description',
          sortable: true
        },
        actions: {
          label: 'Actions',
          class: 'text-center'
        }
      }
    }
  },

  asyncData ({ app, params, error }) {
    const endpoint = `/libcrowds/users/${params.name}/templates`
    return app.$axios.$get(endpoint).then(data => {
      return {
        templates: data.templates
      }
    })
  },

  components: {
    CardBase
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },

    publishedCollections () {
      return this.$store.state.publishedCollections
    }
  },

  methods: {
    /**
     * Get the templates for a collection.
     * @param {Number} id
     *   The category ID.
     */
    getCollectionTemplates (id) {
      return this.templates.map(template => {
        template.project.id = template.id
        return template.project
      }).filter(template => {
        return template.category_id === id
      })
    }
  },

  beforeMount () {
    this.$store.dispatch('UPDATE_CURRENT_TEMPLATE', {})
  }
}
</script>
