<template>
  <card-base
    :title="title"
    :description="description"
    docs="/templates/details/">

    <p slot="guidance">
      Update the core details for the template below. Note that these changes
      will not apply to projects that have already been created from this
      template.
    </p>
    <hr class="my-1">

    <pybossa-form
      no-submit
      submit-text="Update"
      :form="form"
      @submit="onSubmit">
    </pybossa-form>

  </card-base>
</template>

<script>
import VueFormGenerator from 'vue-form-generator'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import PybossaForm from '@/components/forms/PybossaForm'
import { fetchCollectionAndTmpl } from '@/mixins/fetchCollectionAndTmpl'

export default {
  layout: 'admin-template-dashboard',

  mixins: [ metaTags, fetchCollectionAndTmpl ],

  data () {
    return {
      title: 'Update Project Template',
      description: `Edit the project template's core details.`
    }
  },

  components: {
    CardBase,
    PybossaForm
  },

  computed: {
    currentCollection () {
      return this.$store.state.currentCollection
    },

    currentTemplate () {
      return this.$store.state.currentTemplate
    },

    form () {
      return {
        endpoint: '',
        method: 'post',
        model: this.currentTemplate,
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
              hint: 'Appears on the project card shown on the main ' +
                'projects page',
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
     * Update the current template on form submission.
     */
    onSubmit () {
      const endpoint = `/api/category/${this.currentCollection.id}`
      return this.$axios.$put(endpoint, {
        info: this.currentCollection.info
      }).then(data => {
        this.$notifications.success({ message: 'Template updated' })
      }).catch(err => {
        this.$notifications.error({ message: err.messag })
      })
    }
  }
}
</script>
