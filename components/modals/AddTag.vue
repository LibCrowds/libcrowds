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

export default {
  data () {
    return {
      form: {
        model: {},
        schema: {
          fields: [
            {
              model: 'name',
              label: 'Name',
              type: 'input',
              inputType: 'text',
              hint: 'The name of the tag type (e.g. Location).',
              required: true,
              validator: (value) => {
                const currentTags = Object.keys(this.collection.info.tags)
                if (!value || !value.length) {
                  return 'This field is required'
                }
                if (currentTags.filter(tag => (tag.id === value)).length) {
                  return 'A tag type already exists with that name'
                }
              }
            },
            {
              model: 'color',
              label: 'Colour',
              type: 'input',
              inputType: 'color',
              hint: 'A color for the tag.'
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
     * Add a tag type.
     */
    addTag () {
      const tag = {
        name: this.form.model.name,
        color: this.form.model.color
      }

      this.collection.info.tags.push(tag)

      return this.$axios.$put(`/api/category/${this.collection.id}`, {
        info: this.collection.info
      }).then(data => {
        this.$notifications.success({ message: 'Tag type added' })
        this.$emit('update', tag)
        this.processing = false
      })
    },

    /**
     * Reset the model.
     */
    resetModel () {
      this.form.model = {
        name: '',
        color: '#9DD0EC'
      }
    }
  }
}
</script>
