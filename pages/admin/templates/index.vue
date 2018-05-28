<template>
  <card-base
    :title="title"
    :description="description"
    docs="/templates/introduction/">
    <b-btn
      slot="controls"
      class="float-md-right"
      size="sm"
      variant="success"
      :to="{
        name: 'admin-templates-new'
      }">
      New
    </b-btn>

    <p slot="guidance">
      Click the <strong>New</strong> button above to create a new template, or
      edit one of your current templates by locating it in the table below and
      clicking <strong>Open</strong>.
    </p>

    <b-tabs card>
      <b-tab
        no-body
        v-for="collection in collections"
        :title="collection.name"
        :key="collection.id">
        <templates-table
          show-details
          :collection-id="collection.id"
          :templates="templates">
          <template slot="action" slot-scope="template">
            <b-btn
              variant="success"
              size="sm"
              :to="{
                name: 'admin-templates-id',
                params: {
                  id: template.item.id
                }
              }">
              Open
            </b-btn>
          </template>
        </templates-table>
      </b-tab>
    </b-tabs>

  </card-base>
</template>

<script>
import { metaTags } from '@/mixins/metaTags'
import { fetchAll } from '@/utils/fetchAll'
import CardBase from '@/components/cards/Base'
import TemplatesTable from '@/components/tables/Templates'

export default {
  layout: 'admin-templates-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'Project Templates',
      description: 'Create and manage your project templates.'
    }
  },

  asyncData ({ app, params, error }) {
    const tmplEndpoint = `/lc/users/${params.name}/templates`
    return Promise.all([
      fetchAll(app.$axios, 'category'),
      app.$axios.$get(tmplEndpoint)
    ]).then(([categoriesData, tmplData]) => {
      return {
        collections: categoriesData,
        templates: tmplData.templates.map(tmpl => {
          tmpl._showDetails = false
          return tmpl
        })
      }
    })
  },

  components: {
    CardBase,
    TemplatesTable
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    }
  },

  beforeMount () {
    this.$store.dispatch('UPDATE_CURRENT_TEMPLATE', {})
  }
}
</script>
