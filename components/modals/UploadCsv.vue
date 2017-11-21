<template>
  <modal-form
    :form="form"
    :modalId="modalId"
    title="Upload CSV"
    @submit="onSubmit">
  </modal-form>
</template>

<script>
import csvParse from 'csv-parse/lib/sync'
import ModalForm from '@/components/forms/Modal'
import { notifications } from '@/mixins/notifications'

export default {
  mixins: [ notifications ],

  data () {
    return {
      form: {
        model: {
          'file': null
        },
        schema: {
          fields: [
            {
              model: 'file',
              label: 'CSV File',
              type: 'upload',
              placeholder: 'Choose a CSV file...',
              accept: 'text/csv',
              onChanged: (model, schema, event) => {
                model.file = event.target.files[0]
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
    }
  },

  methods: {
    /**
     * Parse and return the CSV data.
     */
    onSubmit () {
      const reader = new FileReader()
      reader.onload = (evt) => {
        const csv = csvParse(evt.target.result)
        this.$emit('submit', csv)
      }
      reader.readAsText(this.form.model.file)
    }
  }
}
</script>
