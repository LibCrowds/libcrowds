<template>
  <card-base :title="title" :description="description">
    <p slot="guidance">
      Update the core details for the template below. Note that these changes
      will not apply to projects that have already been created from this
      template.
    </p>
    <hr>
    <pybossa-form
      submit-text="Update"
      :form="form"
      @success="onFormSuccess">
    </pybossa-form>
  </card-base>
</template>

<script>
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'templates-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'Update Project Template',
      description: `Edit the project template's core details.`
    }
  },

  asyncData ({ app, params, error, store }) {
    const endpoint = `/lc/templates/${params.id}/update`
    return app.$axios.$get(endpoint).then(data => {
      store.dispatch('UPDATE_CURRENT_TEMPLATE', data.template)
      return {
        form: {
          endpoint: endpoint,
          method: 'post',
          model: data.form,
          schema: {
            fields: [
              {
                model: 'name',
                label: 'Name',
                type: 'input',
                inputType: 'text',
                hint: 'A name for the template.'
              },
              {
                model: 'description',
                label: 'Description',
                type: 'textArea',
                rows: 3,
                hint: 'Appears on the project card shown on the main ' +
                  'projects page'
              }
            ]
          }
        }
      }
    }).catch(err => {
      error(err)
    })
  },

  components: {
    CardBase,
    PybossaForm
  },

  methods: {
    /**
     * Update the current template on form submission success.
     * @param {Object} data
     *   The data returned from the form.
     */
    onFormSuccess (data) {
      this.$store.dispatch('UPDATE_CURRENT_TEMPLATE', data.template)
    }
  }
}
</script>
