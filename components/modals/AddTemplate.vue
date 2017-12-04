<template>
  <modal-form
    :form="form"
    :modalId="modalId"
    size="lg"
    title="Add a template"
    @submit="addTemplate"
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
     * Add a template.
     */
    addTemplate () {
      const modelClone = Object.assign({}, this.form.model)
      modelClone.short_name = modelClone.name
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
      this.collection.info.templates[modelClone.short_name] = modelClone
      console.log(this.collection.info.templates)
      return this.$axios.$put(`/api/category/${this.collection.id}`, {
        info: this.collection.info
      }).then(data => {
        this.notifySuccess({ message: 'Template added' })
        this.$emit('update', this.template)
        this.processing = false
      })
    },

    /**
     * Reset the model.
     */
    resetModel () {
      this.form.model = {
        name: '',
        description: '',
        objective: '',
        guidance: '',
        mode: null,
        parent: null,
        help: ''
      }
    }
  }
}
</script>
