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
              maxlength: 50,
              required: true,
              validator: VueFormGenerator.validators.string
            },
            {
              type: 'select',
              label: 'Type',
              model: 'type',
              values: () => {
                return [
                  { id: 'input', name: 'Input' },
                  { id: 'textArea', name: 'TextArea' },
                  { id: 'checkbox', name: 'Checkbox' },
                  { id: 'radios', name: 'Radio' },
                  { id: 'select', name: 'Select' }
                ]
              }
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
              visible: model => {
                return model.type === 'input'
              }
            },
            {
              type: 'input',
              inputType: 'text',
              label: 'Placeholder',
              model: 'placeholder',
              validator: VueFormGenerator.validators.string
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
