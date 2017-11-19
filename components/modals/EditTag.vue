<template>
  <modal-form
    :form="form"
    :modalId="modalId"
    title="Edit tag type"
    @submit="editTag">
  </modal-form>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
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
                if (!value.length) {
                  return 'This field is required'
                }
                if (
                  value !== this.tag.type &&
                  currentTags.indexOf(value) > -1
                ) {
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

  props: {
    modalId: {
      type: String,
      required: true
    },
    collection: {
      type: Object,
      required: true
    },
    tag: {
      type: Object,
      required: true
    }
  },

  components: {
    ModalForm
  },

  methods: {
    /**
     * Submit if valid.
     */
    editTag () {
      delete this.collection.info.tags[this.tag.type]
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
        this.notifySuccess({ message: 'Tag type updated' })
        this.$emit('update', this.tag)
        this.processing = false
      })
    }
  },

  watch: {
    tag (newVal) {
      if (isEmpty(newVal)) {
        this.form.model = {}
      } else {
        const newModel = Object.assign({}, newVal)
        newModel.options = newVal.options.join('\n')
        this.form.model = newModel
      }
    }
  }
}
</script>
