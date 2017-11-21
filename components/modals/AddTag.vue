<template>
  <modal-form
    :form="form"
    :modalId="modalId"
    title="Add a tag type"
    @submit="addTag"
    @shown="resetModel">
  </modal-form>
</template>

<script>
import ModalForm from '@/components/forms/Modal'
import { notifications } from '@/mixins/notifications'

export default {
  mixins: [ notifications ],

  data () {
    return {
      form: {
        model: {},
        schema: {
          fields: [
            {
              model: 'type',
              label: 'Name',
              type: 'input',
              inputType: 'text',
              placeholder: 'Name the tag type (e.g. Location)',
              required: true,
              validator: (value) => {
                const currentTags = Object.keys(this.collection.info.tags)
                if (!value || !value.length) {
                  return 'This field is required'
                }
                if (currentTags.indexOf(value) > -1) {
                  return 'A tag type already exists with that name'
                }
              }
            },
            {
              model: 'color',
              label: 'Colour',
              type: 'input',
              inputType: 'color'
            },
            {
              model: 'options',
              label: 'Tags',
              type: 'textArea',
              rows: 4,
              placeholder: 'Separate tags with a comma or new line'
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
    collection: {
      type: Object,
      required: true
    }
  },

  methods: {
    /**
     * Add a tag.
     */
    addTag () {
      const type = this.form.model.type
      const color = this.form.model.color
      const options = this.form.model.options
        .replace(/\n/g, ',')
        .split(',')
        .map(option => option.trim())
        .filter(option => option.length)

      this.collection.info.tags[type] = {
        options: options,
        color: color
      }
      return this.$axios.$put(`/api/category/${this.collection.id}`, {
        info: this.collection.info
      }).then(data => {
        this.notifySuccess({ message: 'Tag type added' })
        this.$emit('update', this.tag)
        this.processing = false
      })
    },

    /**
     * Reset the model.
     */
    resetModel () {
      this.form.model = {
        type: '',
        options: '',
        color: '#2589BD'
      }
    }
  }
}
</script>
