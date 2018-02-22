<template>
  <modal-form
    :form="form"
    :modalId="modalId"
    title="Add a field"
    @submit="$emit('submit', form.model)"
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
              label: 'Header',
              model: 'header',
              placeholder: 'A header for the exported file',
              required: true,
              validator: VueFormGenerator.validators.string
            },
            {
              type: 'input',
              inputType: 'text',
              label: 'Value',
              model: 'value',
              placeholder: 'A set value for all instances of this field'
            },
            {
              type: 'select',
              label: 'Template',
              model: 'template_id',
              values: this.templates
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
    templates: {
      type: Array,
      required: true
    }
  },

  methods: {
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
