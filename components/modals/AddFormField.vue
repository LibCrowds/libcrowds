<template>
  <modal-form
    :form="form"
    :modalId="modalId"
    title="Add a form field"
    @submit="onSubmit"
    @shown="resetModel">
  </modal-form>
</template>

<script>
import ModalForm from '@/components/forms/Modal'
import { notifications } from '@/mixins/notifications'
import VueFormGenerator from 'vue-form-generator'

export default {
  mixins: [ notifications ],

  data () {
    return {
      form: {
        model: {},
        schema: {
          fields: [
            {
              type: 'input',
              inputType: 'text',
              label: 'Label',
              model: 'label',
              placeholder: 'A label for the form field',
              maxlength: 50,
              required: true,
              validator: VueFormGenerator.validators.string
            },
            {
              type: 'select',
              label: 'Type',
              model: 'type',
              required: true,
              values: () => {
                return [
                  { id: 'input', name: 'Input' },
                  { id: 'textArea', name: 'TextArea' },
                  { id: 'checkbox', name: 'Checkbox' },
                  { id: 'radios', name: 'Radio' },
                  { id: 'select', name: 'Select' }
                ]
              },
              default: 'input'
            },
            {
              type: 'select',
              label: 'Input Type',
              model: 'inputType',
              values: () => {
                return [
                  { id: 'text', name: 'Text' },
                  { id: 'number', name: 'Number' },
                  { id: 'date', name: 'Date' },
                  { id: 'url', name: 'URL' }
                ]
              },
              default: 'text',
              disabled: model => {
                return model.type !== 'input'
              }
            },
            {
              type: 'input',
              inputType: 'text',
              label: 'Placeholder',
              model: 'placeholder',
              placeholder: 'Placeholder text for the form field',
              validator: VueFormGenerator.validators.string
            },
            {
              type: 'input',
              inputType: 'text',
              label: 'Model',
              model: 'model',
              placeholder: 'A key used as an identifier for the field',
              required: true,
              validator: (value) => {
                const models = this.currentFields.map(field => field.model)
                if (!value || !value.length) {
                  return 'This field is required!'
                }
                if (models.indexOf(value) > -1) {
                  return 'The model already contains this key'
                }
              }
            }
          ]
        }
      }
    }
  },

  components: {
    ModalForm
  },

  props: {
    modalId: {
      type: String,
      required: true
    },
    currentFields: {
      type: Array,
      required: true
    }
  },

  methods: {
    /**
     * Handle submit.
     */
    onSubmit () {
      const modelClone = Object.assign({}, this.form.model)
      if (!this.form.model.type === 'input') {
        delete modelClone['inputType']
      }
      this.$emit('submit', this.form.model)
    },

    /**
     * Reset the model.
     */
    resetModel () {
      const schema = this.form.schema
      this.form.model = VueFormGenerator.schema.createDefaultObject(schema)
    }
  }
}
</script>
