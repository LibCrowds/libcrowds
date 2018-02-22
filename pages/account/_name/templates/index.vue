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

    <p slot="guidance">
      Click the <strong>New</strong> button above to create a new template, or
      edit one of your current templates by locating it in the table below and
      clicking <strong>Open</strong>.
    </p>

    <b-tabs card>
      <b-tab
        no-body
        v-for="collection in publishedCollections"
        :title="collection.name"
        :key="collection.id">
        <templates-table
          show-details
          :collection-id="collection.id"
          :templates="templates">
          <template slot="action" scope="template">
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
        </templates-table>
      </b-tab>
    </b-tabs>
  </card-base>
</template>

<script>
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import TemplatesTable from '@/components/tables/Templates'

export default {
  layout: 'templates-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'Project Templates',
      description: 'Create and manage your project templates.'
    }
  },

  asyncData ({ app, params, error }) {
    const endpoint = `/lc/users/${params.name}/templates`
    return app.$axios.$get(endpoint).then(data => {
      return {
        templates: data.templates.map(tmpl => {
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
    },

    publishedCollections () {
      return this.$store.state.publishedCollections
    }
  },

  beforeMount () {
    this.$store.dispatch('UPDATE_CURRENT_TEMPLATE', {})
  }
}
</script>
