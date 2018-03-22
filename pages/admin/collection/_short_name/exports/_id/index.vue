<template>
  <card-base :title="title" :description="description">
    <pybossa-form
      submit-text="Update"
      :form="form"
      @success="onSuccess">

      <div slot="bottom">
        <div class="d-flex align-items-center justify-content-between my-1">
          <label class="mb-0">
            <strong>Export Fields</strong>
          </label>
          <b-btn
            variant="success"
            v-b-modal="addExportFieldModalId">
            Add Field
          </b-btn>
        </div>
        <b-table
          responsive
          striped
          hover
          outlined
          show-empty
          :dark="darkMode"
          :items="form.model.fields"
          :fields="tableFields">
          <template slot="template_id" slot-scope="field">
            {{ getTemplateName(field.item.template_id) }}
          </template>
          <template slot="actions" slot-scope="field">
            <b-btn
              variant="warning"
              size="sm"
              @click="removeFormField(field.item.model)">
              Remove
            </b-btn>
          </template>
        </b-table>
      </div>

    </pybossa-form>

    <add-export-field-modal
      :modal-id="addExportFieldModalId"
      :templates="templates"
      @submit="addExportField">
    </add-export-field-modal>

  </card-base>
</template>

<script>
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import PybossaForm from '@/components/forms/PybossaForm'
import AddExportFieldModal from '@/components/modals/AddExportField'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, metaTags ],

  data () {
    return {
      title: 'Add Export Format',
      description: 'Add an export format.',
      addExportFieldModalId: 'add-export-field-modal',
      tableFields: {
        header: {
          label: 'Header'
        },
        value: {
          label: 'Value'
        },
        template_id: {
          label: 'Template'
        },
        actions: {
          label: 'Actions'
        }
      }
    }
  },

  asyncData ({ app, params, error }) {
    const id = params.id
    const endpoint = `/lc/categories/${params.short_name}/exports/${id}`
    return app.$axios.$get(endpoint).then(data => {
      return {
        templates: data.templates,
        form: {
          endpoint: endpoint,
          method: 'post',
          model: data.form,
          schema: {
            fields: [
              {
                model: 'name',
                label: 'Name',
                type: 'input',
                inputType: 'text',
                placeholder: 'A name for the export format'
              },
              {
                model: 'reference_header',
                label: 'Reference Header',
                type: 'input',
                inputType: 'text',
                placeholder: 'The header for the reference'
              }
            ]
          }
        }
      }
    }).catch(err => {
      error(err)
    })
  },

  components: {
    CardBase,
    PybossaForm,
    AddExportFieldModal
  },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    }
  },

  methods: {
    /**
     * Handle success.
     */
    onSuccess () {
      this.$router.push({
        name: 'admin-collection-short_name-exports',
        params: {
          short_name: this.collection.short_name
        }
      })
    },

    /**
     * Add an export field.
     * @param {Object} data
     *  The data returned from a AddExportField modal.
     */
    addExportField (data) {
      this.form.model.fields.push(data)
    },

    /**
     * Remove form field.
     * @param {Number} index
     *  The index of the field to remove.
     */
    removeFormField (index) {
      const clone = JSON.parse(JSON.stringify(this.form.model.fields))
      this.form.model.fields = clone.splice(index, 1)
    },

    /**
     * Return a template name from its ID.
     * @param {Number} id
     *  The template ID.
     */
    getTemplateName (id) {
      const tmpl = this.templates.filter(tmpl => tmpl.id === id)
      return tmpl.length ? tmpl[0].name : ''
    }
  }
}
</script>
