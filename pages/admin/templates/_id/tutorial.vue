<template>
  <card-base
    :title="title"
    :description="description"
    docs="/templates/tutorial/">
    <p slot="guidance">
      Use the form below to update the tutorial shown when the project first
      loads.
    </p>
    <hr class="my-1">

    <pybossa-form
      submit-text="Update"
      :form="form"
      @success="onFormSuccess">
      <div slot="bottom">
        <label class="ml-0">
          Tutorial
        </label>
        <markdown-editor
          v-model="form.model.tutorial"
          :configs="markdownConfig">
        </markdown-editor>
      </div>
    </pybossa-form>

  </card-base>
</template>

<script>
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'admin-templates-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'Update Template Tutorial',
      description: `Edit the project template's tutorial.`,
      markdownConfig: {
        spellChecker: false
      }
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
            fields: []
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
