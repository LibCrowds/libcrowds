<template>
  <card-base :title="title" :description="description">
    <p slot="guidance">
      Use the form below to update the tutorial shown when the project first
      loads.
    </p>
    <pybossa-form
      submit-text="Update"
      :form="form">
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
import { fetchTemplateById } from '@/mixins/fetchTemplateById'
import { notifications } from '@/mixins/notifications'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'templates-dashboard',

  mixins: [ notifications, metaTags, fetchTemplateById ],

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
    const endpoint = `/lc/users/${params.name}/templates/${params.id}`
    return app.$axios.$get(endpoint).then(data => {
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
  }
}
</script>
