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
import VueFormGenerator from 'vue-form-generator'

export default {
  data () {
    return {
      form: {
        model: {},
        schema: {
          fields: [
            {
              type: 'input',
              inputType: 'text',
              label: 'Model',
              model: 'model',
              required: true,
              validator: (value) => {
                const keys = this.model.map(field => field.model)
                const re = /^[A-Za-z0-9_]*$/
                if (!value || !value.length) {
                  return 'This field is required!'
                }
                if (keys.indexOf(value) > -1) {
                  return 'The model already contains this key'
                }
                if (!re.test(value)) {
                  return 'Can only contain Latin characters, numbers ' +
                    'or underscores'
                }
              },
              hint: 'A key used to identify the field (e.g. title).'
            },
            {
              type: 'input',
              inputType: 'text',
              label: 'Label',
              model: 'label',
              maxlength: 50,
              required: true,
              validator: VueFormGenerator.validators.string,
              hint: 'A label shown above the form field (e.g. Title).'
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
                  { id: 'checkbox', name: 'Checkbox' }
                ]
              },
              selectOptions: {
                hideNoneSelectedText: true
              },
              validator: (value) => {
                if (!value || !value.length) {
                  return 'This field is required!'
                }
              },
              hint: 'The type of the form field.'
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
              disabled: model => {
                return model.type !== 'input'
              },
              selectOptions: {
                hideNoneSelectedText: true
              },
              validator: (value, field, model) => {
                if ((!value || !value.length) && model.type === 'input') {
                  return 'This field is required when the type is "input"'
                }
              },
              hint: 'The specific type of input field.'
            },
            {
              type: 'input',
              inputType: 'text',
              label: 'Placeholder',
              model: 'placeholder',
              validator: VueFormGenerator.validators.string,
              hint: 'Placeholder text for the form field'
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
    model: {
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
      if (this.form.model.type === 'input') {
        // Add name attribute to any input fields
        this.form.model['inputName'] = this.form.model.model
      } else {
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
