<template>
  <card-base :title="title" :description="description">

    <pybossa-form
      submit-text="Update"
      :form="form">

      <div v-if="showFieldsSchemaInput" slot="bottom">
        <div class="d-flex align-items-center justify-content-between my-1">
          <label class="mb-0">
            <strong>Fields Schema</strong>
          </label>
          <b-btn
            variant="success"
            v-b-modal="addFormFieldModalId">
            Add Field
          </b-btn>
        </div>
        <b-table
          responsive
          striped
          hover
          show-empty
          empty-text="Add form fields by clicking the Add Form button above"
          :items="form.model.fields_schema"
          :fields="schemaTableFields">
          <template slot="actions" scope="field">
            <b-btn
              variant="warning"
              size="sm"
              @click="removeFormField(field.item.model)">
              Remove
            </b-btn>
            <b-btn
              variant="secondary"
              class="mx-1"
              size="sm"
              :disabled="isFirst(form.model.fields_schema, field.item)"
              @click="moveItemUp(form.model.fields_schema, field.item)">
              <icon name="arrow-up"></icon>
            </b-btn>
            <b-btn
              variant="secondary"
              size="sm"
              :disabled="isLast(form.model.fields_schema, field.item)"
              @click="moveItemDown(form.model.fields_schema, field.item)">
              <icon name="arrow-down"></icon>
            </b-btn>
          </template>
        </b-table>
      </div>

      <div v-if="showInstitutionCodesInput" slot="bottom">
        <label class="my-1">
          <strong>Institution Codes</strong>
        </label>
        <b-table
          responsive
          striped
          hover
          show-empty
          empty-text="Add instutution codes using the input field below"
          :items="institutionCodeTableItems"
          :fields="institutionTableFields">
          <template slot="actions" scope="institution">
            <b-btn
              variant="warning"
              size="sm"
              @click="removeInstitutionCode(institution.item.code)">
              Remove
            </b-btn>
          </template>
        </b-table>

        <b-input-group class="mt-1">
          <b-form-input ref="institution-code-input"></b-form-input>
          <b-input-group-button slot="right">
            <b-btn
              variant="success"
              @click="addInstitutionCode">
              Add
            </b-btn>
          </b-input-group-button>

        </b-input-group>

      </div>

    </pybossa-form>

    <add-form-field-modal
      v-if="showFieldsSchemaInput"
      :modal-id="addFormFieldModalId"
      :model="form.model.fields_schema"
      @submit="addFormField">
    </add-form-field-modal>

  </card-base>
</template>

<script>
import 'vue-awesome/icons/arrow-up'
import 'vue-awesome/icons/arrow-down'
import { fetchTemplateById } from '@/mixins/fetchTemplateById'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import PybossaForm from '@/components/forms/PybossaForm'
import AddFormFieldModal from '@/components/modals/AddFormField'

export default {
  layout: 'templates-dashboard',

  mixins: [ metaTags, fetchTemplateById ],

  data () {
    return {
      title: 'Update Task Template',
      description: `Edit the project template's task details.`,
      addFormFieldModalId: 'add-form-field-modal',
      schemaTableFields: {
        label: {
          label: 'Label'
        },
        model: {
          label: 'Model',
          class: 'text-center'
        },
        type: {
          label: 'Type',
          class: 'text-center'
        },
        actions: {
          label: 'Actions',
          class: 'text-center'
        }
      },
      institutionTableFields: {
        code: {
          label: 'Code'
        },
        actions: {
          label: 'Actions',
          class: 'text-center'
        }
      }
    }
  },

  asyncData ({ app, params, error }) {
    const name = params.name
    const endpoint = `/libcrowds/users/${name}/templates/${params.id}/task`
    return app.$axios.$get(endpoint).then(data => {
      const fields = {
        'iiif-annotation': [
          {
            model: 'tag',
            label: 'Tag',
            type: 'input',
            inputType: 'text',
            placeholder: 'The main tag for the annotations (e.g. title)'
          },
          {
            model: 'objective',
            label: 'Objective',
            type: 'input',
            inputType: 'text',
            placeholder: 'The main objective of a task (e.g. Transcribe ' +
              'the title)'
          },
          {
            model: 'guidance',
            label: 'Guidance',
            type: 'textArea',
            rows: 3,
            placeholder: 'Short additional guidance that appears underneath' +
              ' the objective'
          },
          {
            model: 'mode',
            label: 'Mode',
            type: 'select',
            values: [
              { id: 'select', name: 'Select' },
              { id: 'transcribe', name: 'Transcribe' }
            ],
            selectOptions: {
              hideNoneSelectedText: true
            }
          }
        ],
        'z3950': [
          {
            model: 'database',
            label: 'Database',
            type: 'select',
            values: data.z3950_databases.map(db => {
              return { id: db[0], name: db[1] }
            })
          }
        ]
      }

      return {
        presenter: data.presenter,
        form: {
          endpoint: endpoint,
          method: 'post',
          model: data.form,
          schema: {
            fields: fields[data.presenter]
          }
        }
      }
    }).catch(err => {
      error(err)
    })
  },

  computed: {
    showFieldsSchemaInput () {
      return (
        this.presenter === 'iiif-annotation' &&
        this.form.model.mode === 'transcribe'
      )
    },

    showInstitutionCodesInput () {
      return this.presenter === 'z3950'
    },

    institutionCodeTableItems () {
      console.log(this.form.model.institutions, this.form.model.institutions.map(item => {
        return { code: item }
      }))
      return this.form.model.institutions.map(item => {
        return { code: item }
      })
    }
  },

  methods: {
    /**
     * Add a form field for transcription tasks.
     * @param {Object} data
     *  The data returned from a AddFormField modal.
     */
    addFormField (data) {
      this.form.model.fields_schema.push(data)
    },

    /**
     * Remove form field.
     * @param {String} key
     *  The model key of the field to remove.
     */
    removeFormField (key) {
      const schema = this.form.model.fields_schema
      this.form.model.fields_schema = schema.filter(field => {
        return field.model !== key
      })
    },

    /**
     * Move an element up in an array.
     * @param {Array} arr
     *  The array.
     * @param {*} elem
     *  The element.
     */
    moveItemUp (arr, elem) {
      const idx = arr.indexOf(elem)
      const clonedArray = JSON.parse(JSON.stringify(arr))
      if (idx > 0) {
        clonedArray[idx] = clonedArray.splice(idx - 1, 1, clonedArray[idx])[0]
      }
      this.form.model.fields_schema = clonedArray
    },

    /**
     * Move an element down in an array.
     * @param {Array} arr
     *  The array.
     * @param {*} elem
     *  The element.
     */
    moveItemDown (arr, elem) {
      const idx = arr.indexOf(elem)
      const clonedArray = JSON.parse(JSON.stringify(arr))
      if (idx < clonedArray.length) {
        clonedArray[idx] = clonedArray.splice(idx + 1, 1, clonedArray[idx])[0]
      }
      this.form.model.fields_schema = clonedArray
    },

    /**
     * Check if an element is the first in an Array.
     * @param {Array} arr
     *  The array.
     * @param {*} elem
     *  The item.
     */
    isFirst (arr, elem) {
      return arr.indexOf(elem) === 0
    },

    /**
     * Check if an item is the last in an Array.
     * @param {Array} arr
     *  The array.
     * @param {*} elem
     *  The element.
     */
    isLast (arr, elem) {
      return arr.indexOf(elem) === arr.length - 1
    },

    /**
     * Remove an institution code.
     * @param {String} code
     *  The array.
     */
    removeInstitutionCode (code) {
      const clone = JSON.parse(JSON.stringify(this.form.model.institutions))
      const idx = clone.indexOf(code)
      this.form.model.institutions = clone.splice(idx, 1)
    },

    /**
     * Add an institution code.
     */
    addInstitutionCode () {
      const val = this.$refs['institution-code-input'].$el.value
      if (val.length) {
        this.form.model.institutions.push(val)
        this.$refs['institution-code-input'].$el.value = ''
      }
    }
  },

  components: {
    CardBase,
    PybossaForm,
    AddFormFieldModal
  }
}
</script>
