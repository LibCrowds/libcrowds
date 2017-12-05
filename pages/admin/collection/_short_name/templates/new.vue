<template>
  <card-base :title="title" :description="description">
    <form-base
      class="pybossa-form"
      show-cancel
      submit-text="Create"
      :processing="processing"
      @submit="addTemplate"
      @cancel="goBack">

      <vue-form-generator
        ref="form"
        :schema="form.schema"
        :model="form.model">
      </vue-form-generator>

    </form-base>
  </card-base>
</template>

<script>
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { notifications } from '@/mixins/notifications'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import FormBase from '@/components/forms/Base'
import VueFormGenerator from 'vue-form-generator'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, notifications, metaTags ],

  data () {
    return {
      title: 'New Project Template',
      description: 'Create a project template.',
      processing: false
    }
  },

  components: {
    CardBase,
    FormBase
  },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    },

    form () {
      return {
        model: {
          'name': '',
          'description': '',
          'objective': '',
          'guidance': '',
          'field': '',
          'parent': null,
          'mode': null
        },
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
              model: 'field',
              label: 'Field',
              type: 'input',
              inputType: 'text',
              placeholder: 'The field being annotated (e.g. title) ',
              required: true,
              validator: VueFormGenerator.validators.string,
              visible: () => {
                return this.collection.info.presenter === 'iiif-annotation'
              }
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
            }
          ]
        }
      }
    }
  },

  methods: {
    /**
     * Add a template.
     */
    addTemplate () {
      if (!this.$refs.form.validate()) {
        this.notifyInvalidForm()
        return
      }

      this.collection.info.templates[this.form.model.name] = this.form.model
      return this.$axios.$put(`/api/category/${this.collection.id}`, {
        info: this.collection.info
      }).then(data => {
        this.notifySuccess({ message: 'Template added' })
        this.goBack()
      })
    },

    /**
     * Go back.
     */
    goBack () {
      this.$router.push({
        name: 'admin-collection-short_name-templates',
        params: {
          short_name: this.collection.short_name
        }
      })
    }
  }
}
</script>
