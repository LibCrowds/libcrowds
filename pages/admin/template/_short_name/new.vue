<template>
  <card-base
    :title="title"
    :description="description"
    docs="/templates/new/">

    <p slot="guidance">
      Project templates contain all of the configuration details used to
      generate projects for a collection microsite. Each template can be used
      to generate a project for all of the microsite's volumes, without having
      to redefine the settings each time.
    </p>
    <p slot="guidance">
      After entering the core details below and clicking
      <strong>Create</strong> you will be given access to futher options to
      help design the task, add a tutorial and set the rules for results
      analysis.
    </p>
    <hr class="my-1">

    <pybossa-form
      no-submit
      show-cancel
      submit-text="Create"
      cancel-text="Back"
      :form="form"
      @submit="onSubmit"
      @cancel="onCancel">
    </pybossa-form>

  </card-base>
</template>

<script>
import VueFormGenerator from 'vue-form-generator'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import PybossaForm from '@/components/forms/PybossaForm'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'

export default {
  layout: 'admin-template-dashboard',

  mixins: [ metaTags, fetchCollectionByName ],

  data () {
    return {
      title: 'New Template',
      description: 'Create a project template.'
    }
  },

  asyncData ({ app, params, error, store }) {
    return app.$axios.$get('/lc/admin/templates').then(data => {
      return {
        templateData: data
      }
    }).catch(err => {
      error(err)
    })
  },

  components: {
    CardBase,
    PybossaForm
  },

  computed: {
    currentCollection () {
      return this.$store.state.currentCollection
    },

    form () {
      return {
        endpoint: '',
        method: 'post',
        model: this.templateData.base,
        schema: {
          fields: [
            {
              model: 'name',
              label: 'Name',
              type: 'input',
              inputType: 'text',
              hint: 'A name for the template.',
              required: true,
              validator: VueFormGenerator.validators.string
            },
            {
              model: 'description',
              label: 'Description',
              type: 'textArea',
              rows: 3,
              hint: 'Appears underneath the title on the project cards.',
              required: true,
              validator: VueFormGenerator.validators.string
            }
          ]
        }
      }
    }
  },

  methods: {
    /**
     * Handle success.
     *
     * Add the new template to the selected collection.
     * @param {Object} formData
     *   The form data.
     */
    onSubmit (formData) {
      const endpoint = `/api/category/${this.currentCollection.id}`
      const infoClone = JSON.parse(JSON.stringify(this.currentCollection.info))
      infoClone.templates.push(formData)
      return this.$axios.$put(endpoint, { info: infoClone }).then(data => {
        this.$notifications.success({ message: 'Template created' })
        this.$router.push({
          name: 'admin-template-short_name-id',
          params: {
            id: this.currentCollection.id
          }
        })
      }).catch(err => {
        this.$notifications.error({ message: err.messag })
      })
    },

    /**
     * Handle cancel.
     */
    onCancel () {
      this.$router.push({
        name: 'admin-template-short_name',
        params: {
          short_name: this.currentCollection.short_name
        }
      })
    }
  },

  beforeMount () {
    this.$store.dispatch('UPDATE_CURRENT_TEMPLATE', {})
  }
}
</script>
