<template>
  <form-base
    class="pybossa-form"
    :show-cancel="showCancel"
    :submit-text="submitText"
    :cancel-text="cancelText"
    :processing="processing"
    @submit="submit"
    @cancel="$emit('cancel')">

    <vue-form-generator
      ref="form"
      :schema="form.schema"
      :model="form.model">
    </vue-form-generator>

    <card-base
      title="Form"
      class="my-2"
      v-if="form.model.mode === 'transcribe'">
      <b-btn
        slot="controls"
        variant="success"
        class="float-right"
        size="sm"
        v-b-modal="addFormFieldModalId">
        Add field
      </b-btn>

      <b-card-body>
        <div v-if="form.model.schema.length">
          <vue-form-generator
            :schema="readOnlySchema"
            :model="{}">
          </vue-form-generator>
        </div>
        <p v-else class="mb-0">
          Transcription tasks require at least one form field. Click the
          <strong>Add field</strong> button above.
        </p>
      </b-card-body>

      <add-form-field-modal
        lazy
        :modal-id="addFormFieldModalId"
        @submit="addFormField">
      </add-form-field-modal>
    </card-base>
  </form-base>
</template>

<script>
import { notifications } from '@/mixins/notifications'
import FormBase from '@/components/forms/Base'
import VueFormGenerator from 'vue-form-generator'
import CardBase from '@/components/cards/Base'
import AddFormFieldModal from '@/components/modals/AddFormField'

export default {
  mixins: [ notifications ],

  data () {
    return {
      addFormFieldModalId: 'add-form-field-modal'
    }
  },

  components: {
    FormBase,
    CardBase,
    AddFormFieldModal
  },

  props: {
    formModel: {
      type: Object,
      required: true,
      validator: value => {
        const required = [
          'name',
          'description',
          'objective',
          'guidance',
          'field',
          'parent',
          'mode',
          'schema'
        ]
        return required.every(key => {
          return value.hasOwnProperty(key)
        })
      }
    },
    submitText: {
      type: String,
      default: 'Submit'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    showCancel: {
      type: Boolean,
      default: false
    },
    processing: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    },

    form () {
      return {
        model: this.formModel,
        schema: {
          fields: [
            {
              model: 'name',
              label: 'Name',
              type: 'input',
              inputType: 'text',
              placeholder: 'The name of the template (e.g. Mark Titles)',
              required: true,
              validator: (value) => {
                const templates = Object.keys(this.collection.info.templates)
                if (!value || !value.length) {
                  return 'This field is required'
                }
                if (templates.indexOf(value) > -1) {
                  return 'A template already exists with that name'
                }
              }
            },
            {
              model: 'description',
              label: 'Description',
              type: 'input',
              inputType: 'text',
              placeholder: 'A short description of the project',
              required: true,
              validator: VueFormGenerator.validators.string
            },
            {
              model: 'objective',
              label: 'Objective',
              type: 'input',
              inputType: 'text',
              placeholder: 'The task objective',
              required: true,
              validator: VueFormGenerator.validators.string
            },
            {
              model: 'guidance',
              label: 'Guidance',
              type: 'input',
              inputType: 'text',
              placeholder: 'Short help text that appears underneath the ' +
                'objective',
              required: true,
              validator: VueFormGenerator.validators.string
            },
            {
              model: 'field',
              label: 'Field',
              type: 'input',
              inputType: 'text',
              placeholder: 'The field being annotated (e.g. title) ',
              required: true,
              validator: VueFormGenerator.validators.string,
              visible: () => {
                return this.collection.info.presenter === 'iiif-annotation'
              }
            },
            {
              model: 'parent',
              label: 'Parent',
              type: 'select',
              values: Object.keys(this.collection.info.templates),
              default: 'select',
              visible: () => {
                return this.collection.info.presenter === 'iiif-annotation'
              }
            },
            {
              model: 'mode',
              label: 'Mode',
              type: 'select',
              values: [
                {
                  id: 'select',
                  name: 'Select'
                },
                {
                  id: 'transcribe',
                  name: 'Transcribe'
                }
              ],
              default: 'select',
              required: true,
              visible: () => {
                return this.collection.info.presenter === 'iiif-annotation'
              },
              validator: VueFormGenerator.validators.required
            }
          ]
        }
      }
    },

    readOnlySchema () {
      return this.form.model.schema.map(item => {
        item.readonly = true
        return item
      })
    }
  },

  methods: {
    /**
     * Emit the submit event, if the form is valid.
     */
    submit () {
      if (!this.$refs.form.validate()) {
        this.notifyInvalidForm()
        return
      }
      this.$emit('submit', this.form.model)
    },

    /**
     * Add a form field to the project template schema.
     * @param {Object} data
     *   The form field data.
     */
    addFormField (data) {
      this.form.model.schema.push(data)
    }
  }
}
</script>
