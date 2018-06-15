<template>
  <card-base
    :title="title"
    :description="description"
    docs="/templates/task/">

    <p slot="guidance">
      {{ localConfig.brand }} projects are sets of similar tasks. For example,
      a project might be created to transcribe all of the titles in a group of
      images.
    </p>
    <p slot="guidance">
      Use the form below to configure the task for all projects generated using
      this template. The options shown will vary depending on the task
      presenter chosen for the collection.
    </p>
    <hr class="my-1">

    <b-card-body v-if="!currentCollection.info.presenter">
      <b-alert show variant="warning" class="mb-0">
        This collection does not have a task presenter and therefore the
        task details cannot be updated. Before designing the task, please
        <nuxt-link
          :to="{
            name: 'admin-collection-short_name-presenter',
            params: {
              short_name: currentCollection.short_name
            }
          }">
          set the task presenter.
        </nuxt-link>
      </b-alert>
    </b-card-body>

    <pybossa-form
      v-else
      no-submit
      submit-text="Update"
      :form="form"
      @submit="onSubmit">

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
          <template slot="actions" slot-scope="field">
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
import 'vue-awesome/icons/times'
import 'vue-awesome/icons/arrow-up'
import 'vue-awesome/icons/arrow-down'
import VueFormGenerator from 'vue-form-generator'
import localConfig from '@/local.config'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import PybossaForm from '@/components/forms/PybossaForm'
import AddFormFieldModal from '@/components/modals/AddFormField'
import { fetchCollectionAndTmpl } from '@/mixins/fetchCollectionAndTmpl'

export default {
  layout: 'admin-template-dashboard',

  mixins: [ metaTags, fetchCollectionAndTmpl ],

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
      }
    }
  },

  asyncData ({ app, params, error, store }) {
    return app.$axios.$get('/lc/admin/templates').then(data => {
      return {
        templateData: data
      }
    }).catch(err => {
      error(err)
    })
  },

  computed: {
    currentCollection () {
      return this.$store.state.currentCollection
    },

    currentTemplate () {
      return this.$store.state.currentTemplate
    },

    form () {
      const presenter = this.currentCollection.info.presenter
      const fields = {
        'iiif-annotation': [
          {
            model: 'tag',
            label: 'Tag',
            type: 'input',
            inputType: 'text',
            hint: 'Used to group the annotations.',
            required: true,
            validator: (value) => {
              return new Promise((resolve, reject) => {
                if (!value.length) {
                  resolve([ 'This field is required!' ])
                }

                this.$axios.$get('/api/category', {
                  params: {
                    id: this.currentCollection.id,
                    info: {
                      templates: [
                        {
                          task: {
                            tag: value
                          }
                        }
                      ]
                    }
                  }
                }).then(data => {
                  if (data.length) {
                    resolve([
                      `The tag should be unique for this collection.`
                    ])
                  } else {
                    resolve()
                  }
                })
              })
            }
          },
          {
            model: 'objective',
            label: 'Objective',
            type: 'input',
            inputType: 'text',
            hint: 'Shown at the top of the task sidebar, this is always ' +
              'visible to volunteers.',
            required: true,
            validator: VueFormGenerator.validators.string
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
          },
          {
            model: 'rejection',
            label: 'Reasons for Rejection',
            type: 'array',
            hint: 'These reasons will be added to a dropdown list from ' +
              'which volunteers can specify why a task is invalid.'
          }
        ],
        'z3950': [
          {
            model: 'database',
            label: 'Database',
            type: 'select',
            values: this.templateData.z3950_databases.map(db => {
              return { id: db, name: db }
            }),
            hint: 'The Z39.50 database that to search for matching records.'
          },
          {
            model: 'institutions',
            label: 'Institution Codes',
            type: 'array',
            hint: 'The institutions that you trust to have created or ' +
              'transcribed quality records. The search results will be ' +
              'limited to those with one of the given institution codes in ' +
              'MARC fields 040$a or 040$c.'
          }
        ]
      }
      const currentTaskData = this.currentTemplate.hasOwnProperty('task')
        ? this.currentTemplate.task
        : {}

      return {
        endpoint: '',
        method: 'post',
        model: Object.assign(
          this.templateData.task[presenter],
          currentTaskData
        ),
        schema: {
          fields: fields[presenter]
        }
      }
    },

    showFieldsSchemaInput () {
      return (
        this.currentCollection.info.presenter === 'iiif-annotation' &&
        this.form.model.mode === 'transcribe'
      )
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
      if (idx > 0) {
        arr.splice(idx - 1, 0, arr.splice(idx, 1)[0])
      }
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
      if (idx < arr.length) {
        arr.splice(idx + 1, 0, arr.splice(idx, 1)[0])
      }
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
     * Update the current template on form submission.
     * @param {Object} formData
     *   The form data.
     */
    onSubmit (formData) {
      const endpoint = `/api/category/${this.currentCollection.id}`
      this.currentTemplate.task = formData
      return this.$axios.$put(endpoint, {
        info: this.currentCollection.info
      }).then(data => {
        this.$notifications.success({ message: 'Template updated' })
      }).catch(err => {
        this.$notifications.error({ message: err.messag })
      })
    }
  },

  components: {
    CardBase,
    PybossaForm,
    AddFormFieldModal
  }
}
</script>
