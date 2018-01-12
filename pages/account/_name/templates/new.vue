<template>
  <card-base :title="title" :description="description">

    <b-card-body class="pb-0">
      <p>
        Use the form below to generate a new project template.
      </p>
      <p>
        These templates can then be used by anyone to generate new projects
        for a collection microsite. For example, if you wanted to discover all
        song titles in a particular set of volumes you could create two
        templates, one two mark out those song titles and one to transcribe
        them.
      </p>
      <p>
        After creating your template using the core details below you will be
        given futher options to design your task, add tags to help people
        discover your project and (depending on the type of task) set the
        rules for results analysis.
      </p>
      <p>
        See the
        <a :href="localConfig.docs" target="_blank">full documentation</a>
        for further guidance.
      </p>
      <hr class="mt-3">
    </b-card-body>

    <pybossa-form
      submit-text="Create"
      :form="form"
      @success="onSuccess">
    </pybossa-form>
  </card-base>
</template>

<script>
import localConfig from '@/local.config'
import { notifications } from '@/mixins/notifications'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'templates-dashboard',

  mixins: [ notifications, metaTags ],

  data () {
    return {
      title: 'New Template',
      description: 'Create a project template.',
      localConfig: localConfig
    }
  },

  asyncData ({ app, params, error }) {
    const tmplEndpoint = `/libcrowds/users/${params.name}/templates`
    return Promise.all([
      app.$axios.$get('/api/category', { params: { limit: 100 } }),
      app.$axios.$get(tmplEndpoint)
    ]).then(([categoriesData, tmplData]) => {
      return {
        form: {
          endpoint: tmplEndpoint,
          method: 'post',
          model: tmplData.form,
          schema: {
            fields: [
              {
                model: 'category_id',
                label: 'Collection',
                type: 'select',
                values: categoriesData.map(category => {
                  return { id: category.id, name: category.name }
                })
              },
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
  },

  methods: {
    /**
     * Handle success.
     */
    onSuccess (data) {
      console.log(data)
    }
  }
}
</script>
