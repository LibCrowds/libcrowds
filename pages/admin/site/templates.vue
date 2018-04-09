<template>
  <card-base :title="title" :description="description">
    <templates-table
      show-details
      :fields="tableFields"
      :templates="templates"
      :ignore-diff="['category_name']">
      <template slot="action" slot-scope="tmpl">
        <b-btn
          variant="warning"
          size="sm"
          @click="rejectUpdates(tmpl.item)">
          Reject
        </b-btn>
        <b-btn
          variant="success"
          size="sm"
          @click="approveUpdates(tmpl.item)">
          Approve
        </b-btn>
      </template>
    </templates-table>
  </card-base>
</template>

<script>
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import TemplatesTable from '@/components/tables/Templates'

export default {
  layout: 'admin-site-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'Pending Templates',
      description: 'Check templates pending approval.',
      tableFields: {
        name: {
          label: 'Name'
        },
        category_name: {
          label: 'Collection',
          class: 'text-center d-none d-md-table-cell',
          sortable: true
        }
      }
    }
  },

  asyncData ({ params, app, error }) {
    const tmplEndpoint = '/lc/admin/templates/pending'
    return Promise.all([
      app.$axios.$get('/api/category', {
        params: {
          limit: 100
        }
      }),
      app.$axios.$get(tmplEndpoint)
    ]).then(([categoriesData, tmplData]) => {
      return {
        collections: categoriesData,
        templates: tmplData.templates.map(tmpl => {
          tmpl._showDetails = false
          try {
            tmpl.category_name = categoriesData.filter(category => {
              return category.id === tmpl.category_id
            })[0].name
          } catch (err) {
            tmpl.category_name = null
            console.warn('Invalid category_id')
          }
          return tmpl
        })
      }
    })
  },

  components: {
    CardBase,
    TemplatesTable
  },

  methods: {
    /**
     * Approve updates to a template.
     * @param {Object} template
     *   The template.
     */
    approveUpdates (template) {
      const endpoint = `/lc/admin/templates/${template.id}/approve`
      this.$swal({
        title: 'Accept the updates',
        html: `You are about to confirm updates to the "${template.name}"
          template. These updates will be applied to all current and
          future projects using the template.
          <br><br>Click OK to continue.`,
        showCancelButton: true,
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this.$axios.$get(endpoint).then(data => {
            return this.$axios.$post(endpoint, {
              csrf: data.csrf
            })
          })
        }
      }).then(data => {
        this.removeTemplateFromTable(template)
        this.$notifications.flash(data)
        this.$store.dispatch('UPDATE_N_PENDING_TEMPLATES', this.$axios)
      }).catch(err => {
        if (typeof err === 'object' && err.hasOwnProperty('dismiss')) {
          this.$nuxt.error(err)
        }
      })
    },

    /**
     * Reject updates to a template.
     * @param {Object} template
     *   The template.
     */
    rejectUpdates (template) {
      const endpoint = `/lc/admin/templates/${template.id}/reject`
      this.$swal({
        title: 'Reject the updates',
        html: `Please write a message to the template owner to explain why the
          updates have been rejected and what should be changed before they
          are accepted.`,
        input: 'textarea',
        inputPlaceholder: 'Type your message here',
        showCancelButton: true,
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: (reason) => {
          return this.$axios.$get(endpoint).then(data => {
            return this.$axios.$post(endpoint, {
              csrf: data.csrf,
              reason: reason
            })
          })
        }
      }).then(data => {
        this.removeTemplateFromTable(template)
        this.$notifications.flash(data)
        this.$store.dispatch('UPDATE_N_PENDING_TEMPLATES', this.$axios)
      }).catch(err => {
        if (typeof err === 'object' && err.hasOwnProperty('dismiss')) {
          this.$nuxt.error(err)
        }
      })
    },

    /**
     * Remove a template from the table.
     * @param {Object} template
     *   The template.
     */
    removeTemplateFromTable (template) {
      this.templates = this.templates.filter(tmpl => {
        return tmpl.id !== template.id
      })
    }
  }
}
</script>
