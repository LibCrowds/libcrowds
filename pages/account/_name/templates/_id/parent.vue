<template>
  <card-base :title="title" :description="description">

    <p slot="guidance">
      Use the form below to select the type of parent project from which
      projects using this template must be built.
    </p>
    <p slot="guidance">
      This option is useful for creating chains of projects where the tasks
      that need to be created for one project rely on the results of another.
      For example, you might want to create two project types, one to mark up
      the titles in a set of images and another to transcribe them. In this
      case, the marking up project would be the parent and the transcription
      project would be the child.
    </p>
    <hr class="my-1">

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
      title: 'Update Parent Template',
      description: 'Select a parent template.'
    }
  },

  async asyncData ({ app, params, error, store }) {
    const tmplEndpoint = `/lc/templates/${params.id}/update`
    let tmplData = {}
    let category = {}

    try {
      tmplData = await app.$axios.$get(tmplEndpoint)
      const categoryId = tmplData.template.category_id
      category = await app.$axios.$get(`/api/category/${categoryId}`)
    } catch (err) {
      error(err)
    }

    store.dispatch('UPDATE_CURRENT_TEMPLATE', tmplData.template)

    return {
      form: {
        endpoint: tmplEndpoint,
        method: 'post',
        model: tmplData.form,
        schema: {
          fields: [
            {
              model: 'parent_template_id',
              label: 'Parent Template',
              type: 'select',
              values: category.info.templates || [],
              hint: 'Use the results of a parent project of the selected type.'
            }
          ]
        }
      }
    }
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
      this.$store.dispatch('UPDATE_N_PENDING_TEMPLATES', this.$axios)
    }
  }
}
</script>
