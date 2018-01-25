<template>
  <card-base :title="title" :description="description">
    <p slot="guidance">
      Update the core details for the template below. Note that these changes
      will not apply to projects that have already been created from this
      template.
    </p>
    <pybossa-form
      submit-text="Update"
      :form="form">
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
      title: 'Update Project Template',
      description: `Edit the project template's core details.`,
      processing: false
    }
  },

  asyncData ({ app, params, error, store }) {
    const endpoint = `/libcrowds/users/${params.name}/templates/${params.id}`
    return app.$axios.$get(endpoint).then(data => {
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
                placeholder: 'A name for the template (e.g. Transcribe Titles)'
              },
              {
                model: 'description',
                label: 'Description',
                type: 'textArea',
                rows: 3,
                placeholder: 'This appears on the project cards that are ' +
                  'shown on the main projects page'
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
  }
}
</script>
