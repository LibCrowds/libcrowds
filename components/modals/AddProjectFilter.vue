<template>
  <modal-form
    :form="form"
    :modalId="modalId"
    title="Add a project filter"
    @submit="addProjectFilter"
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
              hint: 'The name of the project filter (e.g. Location).',
              required: true,
              validator: (value) => {
                const projectFilters = this.collection.info.project_filters
                const currentFilters = Object.keys(projectFilters)
                if (!value || !value.length) {
                  return 'This field is required'
                }
                if (currentFilters.filter(f => (f.id === value)).length) {
                  return 'A project filter already exists with that name'
                }
              }
            },
            {
              model: 'color',
              label: 'Colour',
              type: 'input',
              inputType: 'color',
              hint: 'A color for the project filter.'
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
     * Add a project filter.
     */
    addProjectFilter () {
      const filter = {
        name: this.form.model.name,
        color: this.form.model.color
      }

      this.collection.info.project_filters.push(filter)

      return this.$axios.$put(`/api/category/${this.collection.id}`, {
        info: this.collection.info
      }).then(data => {
        this.$notifications.success({ message: 'Project filter added' })
        this.$emit('update', filter)
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
