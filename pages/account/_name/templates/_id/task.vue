<template>
  <card-base :title="title" :description="description">
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
      title: 'Update Task Template',
      description: `Edit the project template's task details.`,
      processing: false
    }
  },

  asyncData ({ app, params, error }) {
    const name = params.name
    const endpoint = `/libcrowds/users/${name}/templates/${params.id}/task`
    return app.$axios.$get(endpoint).then(data => {
      console.log(data)
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
