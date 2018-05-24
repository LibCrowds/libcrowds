<template>
  <card-base
    :title="title"
    :description="description"
    docs="/projects/webhooks/">

    <p slot="guidance">
      The webhook associated with a project will be set during project
      creation. However, on the rare occasion that it is necessary, the
      webhook can be changed via the form below.
    </p>
    <hr class="my-1">

    <pybossa-form
      submit-text="Update"
      :form="form">
    </pybossa-form>

  </card-base>
</template>

<script>
import { fetchProjectByName } from '@/mixins/fetchProjectByName'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'admin-project-dashboard',

  middleware: 'is-admin',

  mixins: [ fetchProjectByName, metaTags ],

  data () {
    return {
      title: 'Webhooks',
      description: `Manage the project's webhooks.`,
      filter: null,
      filterBy: 'name'
    }
  },

  asyncData ({ params, app, error }) {
    const endpoint = `/project/${params.short_name}/update`
    return app.$axios.$get(endpoint).then(data => {
      return {
        form: {
          endpoint: endpoint,
          method: 'post',
          model: data.form,
          schema: {
            fields: [
              {
                model: 'webhook',
                label: 'Webhook URL',
                type: 'input',
                inputType: 'text',
                hint: 'The webhook URL used for results analysis'
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
