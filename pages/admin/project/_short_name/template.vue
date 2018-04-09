<template>
  <card-base :title="title" :description="description">
    <templates-table
      show-details
      :collection-id="project.category_id"
      :templates="currentCollection.info.templates">
      <template slot="action" slot-scope="tmpl">
        <b-btn
          :variant="tmpl.item.id !== currentTmplId ? 'success' : 'warning'"
          size="sm"
          @click="updateTemplate(tmpl.item)">
          {{ tmpl.item.id !== currentTmplId ? 'Select' : 'Deselect' }}
        </b-btn>
        <b-btn
          variant="success"
          size="sm"
          :to="{
            name: 'account-name-templates-id',
            params: {
              name: currentUser.name,
              id: tmpl.item.id
            }
          }">
          Edit
        </b-btn>
      </template>
    </templates-table>
  </card-base>
</template>

<script>
import { fetchProjectAndCollection } from '@/mixins/fetchProjectAndCollection'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import TemplatesTable from '@/components/tables/Templates'

export default {
  layout: 'admin-project-dashboard',

  middleware: 'is-admin',

  mixins: [ fetchProjectAndCollection, metaTags ],

  data () {
    return {
      title: 'Template',
      description: 'Choose the template associated with this project.',
      filter: null,
      filterBy: 'name'
    }
  },

  components: {
    CardBase,
    TemplatesTable
  },

  computed: {
    project () {
      return this.$store.state.currentProject
    },

    currentCollection () {
      return this.$store.state.currentCollection
    },

    currentTmplId () {
      return this.project.info.template_id
    },

    publishedCollections () {
      return this.$store.state.publishedCollections
    },

    currentUser () {
      return this.$store.state.currentUser
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

      this.$swal({
        title: `Update Template`,
        html: `Updating the a project's template is dangerous and should
          not normally be necessary. The option is only included here to help
          with cases such as migration to the project template system.<br><br>
          If you're sure you want to do this, click OK to continue.`,
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this.$axios.$put(`/api/project/${this.project.id}`, {
            info: infoClone
          }).catch(err => {
            this.$notifications.error({ message: err.message })
          })
        }
      }).then(data => {
        if (data) {
          this.$notifications.success({
            message: 'Template deleted'
          })
          this.$notifications.success({ message: 'Template updated' })
          this.$store.dispatch('UPDATE_CURRENT_PROJECT', data)
          this.analyseAllResults()
        }
      }).catch(err => {
        if (typeof err === 'object' && err.hasOwnProperty('dismiss')) {
          this.$nuxt.error(err)
        }
      })
    },

    /**
     * Analyse all results.
     */
    analyseAllResults () {
      this.$swal({
        title: `Reanalyse Results`,
        html: `As the analysis rules specified in the new template may be
          different it is recommended to rerun the analysis for all of the
          project's results.<br><br>
          Click OK to trigger this process.`,
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this.$axios.$post(this.project.webhook, {
            all: 1,
            project_short_name: this.project.short_name
          }).catch(err => {
            this.$notifications.error({ message: err.message })
          })
        }
      }).then(result => {
        if (result) {
          this.$notifications.success({ message: result.message })
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
