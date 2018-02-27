<template>
  <card-base :title="title" :description="description">
    <p slot="guidance">
      {{ localConfig.brand }} projects are sets of similar tasks, for example,
      to transcribe all of the titles in a group of images. Use the form below
      to configure the task for all projects generated using this template. The
      options shown will vary depending on the task presenter chosen for the
      collection, which in this case is the <strong>{{ presenter }}</strong>
      task presenter.
    </p>
    <hr>
    <b-card-body v-if="!presenter">
      <b-alert show variant="warning" class="mb-0">
        This collection has an invalid task presenter and therefore the task
        template cannot be updated. Please contact and administrator.
      </b-alert>
    </b-card-body>
    <pybossa-form
      v-else
      submit-text="Update"
      :form="form"
      @success="onFormSuccess">
      <div v-if="showFieldsSchemaInput" slot="bottom">
        <div class="d-flex align-items-center justify-content-between my-1">
          <b-form-group label="Fields Schema">
            <div slot="description">
              Configure the transcription form shown to volunteers.
            </div>
          </b-form-group>
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
          outlined
          show-empty
          :dark="darkMode"
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
        <b-form-group label="Institution Codes">
          <b-input-group class="mt-1">
            <b-form-input
              ref="institution-code-input"
              placeholder="Enter a MARC institution code">
            </b-form-input>
            <b-input-group-append>
              <b-btn
                variant="success"
                @click="addInstitutionCode">
                Add
              </b-btn>
            </b-input-group-append>
          </b-input-group>
          <div slot="description">
            The institutions that you trust to have created or transcribed
            quality records. The search results will be limited to those with
            one of the given institution codes in MARC fields 040$a or 040$c.
          </div>
        </b-form-group>
        <b-table
          responsive
          striped
          hover
          outlined
          show-empty
          empty-text="Add instutution codes using the input field below"
          :dark="darkMode"
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
import localConfig from '@/local.config'
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
      title: 'Update Template Task',
      description: `Edit the project template's task details.`,
      localConfig: localConfig,
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

  asyncData ({ app, params, error, redirect }) {
    const endpoint = `/lc/templates/${params.id}/task`
    return app.$axios.$get(endpoint).then(data => {
      if (!('presenter' in data)) {
        return {
          presenter: null
        }
      }

      const fields = {
        'iiif-annotation': [
          {
            model: 'tag',
            label: 'Tag',
            type: 'input',
            inputType: 'text',
            hint: 'Used to group the annotations.'
          },
          {
            model: 'objective',
            label: 'Objective',
            type: 'input',
            inputType: 'text',
            hint: 'Shown at the top of the task sidebar, this is always ' +
              'visible to volunteers.'
          },
          {
            model: 'guidance',
            label: 'Guidance',
            type: 'textArea',
            rows: 3,
            hint: 'Shown directly under the objective, this is always ' +
              'visible to volunteers (brief guidance works best).'
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
            },
            hint: 'Select mode is used to mark up areas of an image, ' +
              'whereas Transcribe mode is used to transcribe specified fields.'
          }
        ],
        'z3950': [
          {
            model: 'database',
            label: 'Database',
            type: 'select',
            values: data.z3950_databases.map(db => {
              return { id: db[0], name: db[1] }
            }),
            hint: 'The Z39.50 database that to search for matching records.'
          }
        ]
      }

      let schema = {}
      try {
        schema = {
          fields: fields[data.presenter]
        }
      } catch (err) {
        return {
          presenter: null
        }
      }

      return {
        presenter: data.presenter,
        form: {
          endpoint: endpoint,
          method: 'post',
          model: data.form,
          schema: schema
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
      this.form.model.institutions = clone.filter(inst => {
        return code !== inst
      })
    },

    /**
     * Add an institution code.
     */
    addInstitutionCode () {
      const elem = this.$refs['institution-code-input'].$el
      const codes = this.form.model.institutions
      if (elem.value.length && codes.indexOf(elem.value) < 0) {
        this.form.model.institutions.push(elem.value)
        elem.value = ''
        elem.focus()
      } else if (codes.indexOf(elem.value) > -1) {
        this.$notifications.flash({
          'status': 'warning',
          'flash': 'That code already exists'
        })
      }
    },

    /**
     * Update the current template on form submission success.
     * @param {Object} data
     *   The data returned from the form.
     */
    onFormSuccess (data) {
      this.$store.dispatch('UPDATE_CURRENT_TEMPLATE', data.template)
    }
  },

  components: {
    CardBase,
    PybossaForm,
    AddFormFieldModal
  }
}
</script>
