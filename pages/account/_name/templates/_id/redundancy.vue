<template>
  <card-base :title="title" :description="description">
    <p slot="guidance">
      Use the form below to configure when a task is considered complete and
      a final result created.
    </p>
    <p slot="guidance">
      Result analysis will first be triggered once the minimum number of
      contributions have been made. If the task type determines that a number
      of contributions must match, before a final result is created, then
      contributions will continue to be collected until that minimum number of
      matches is established, or the maximum number of contributions is
      reached.
    </p>
    <hr>
    <pybossa-form
      submit-text="Update"
      :form="form">
    </pybossa-form>
  </card-base>
</template>

<script>
import { fetchTemplateById } from '@/mixins/fetchTemplateById'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'templates-dashboard',

  mixins: [ metaTags, fetchTemplateById ],

  data () {
    return {
      title: 'Update Template Redundancy',
      description: `Edit the task redundancy settings.`
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
            fields: [
              {
                model: 'min_answers',
                label: 'Minimum Contributions',
                type: 'input',
                inputType: 'integer',
                hint: 'The minimum number of contributions accepted before ' +
                  'a final result is created.'
              },
              {
                model: 'max_answers',
                label: 'Maximum Contributions',
                type: 'input',
                inputType: 'integer',
                hint: 'The maximum number of contributions accepted before ' +
                'a task is abandoned.'
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
