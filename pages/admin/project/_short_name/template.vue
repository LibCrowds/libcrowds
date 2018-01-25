<template>
  <card-base :title="title" :description="description">
    <b-tabs ref="tabs" card>
      <b-tab
        no-body
        v-for="collection in publishedCollections"
        :title="collection.name"
        :key="collection.id">
        <templates-table
          show-details
          :collection-id="collection.id"
          :templates="templates">
          <template slot="action" scope="tmpl">
            <b-btn
              :variant="tmpl.item.id !== currentTmplId ? 'success' : 'warning'"
              size="sm"
              @click="updateTemplate(tmpl.item)">
              {{ tmpl.item.id !== currentTmplId ? 'Select' : 'Deselect' }}
            </b-btn>
          </template>
        </templates-table>
      </b-tab>
    </b-tabs>
  </card-base>
</template>

<script>
import { notifications } from '@/mixins/notifications'
import { fetchProjectAndCollection } from '@/mixins/fetchProjectAndCollection'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import TemplatesTable from '@/components/tables/Templates'

export default {
  layout: 'admin-project-dashboard',

  middleware: 'is-admin',

  mixins: [ fetchProjectAndCollection, notifications, metaTags ],

  data () {
    return {
      title: 'Template',
      description: 'Choose the template associated with this project.',
      filter: null,
      filterBy: 'name'
    }
  },

  asyncData ({ params, app, error }) {
    return app.$axios.$get(`/libcrowds/templates/`).then(data => {
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
    project () {
      return this.$store.state.currentProject
    },

    currentTmplId () {
      return this.project.info.template_id
    },

    publishedCollections () {
      return this.$store.state.publishedCollections
    }
  },

  methods: {
    /**
     * Update the template for the project.
     * @param {Object} template
     *   The template.
     */
    updateTemplate (template) {
      let infoClone = Object.assign({}, this.project.info)

      if (!template || this.currentTmplId === template.id) {
        infoClone.template_id = null
      } else {
        infoClone.template_id = template.id
      }

      this.$axios.$put(`/api/project/${this.project.id}`, {
        info: infoClone
      }).then(data => {
        this.notifySuccess({ message: 'Template updated' })
        this.$store.dispatch('UPDATE_CURRENT_PROJECT', data)
      }).catch(err => {
        this.$nuxt.error(err)
      })
    }
  }
}
</script>
