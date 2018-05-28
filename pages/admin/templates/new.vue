<template>
  <card-base
    :title="title"
    :description="description"
    docs="/templates/new/">
    <p slot="guidance">
      Project templates contain all of the configuration details used to
      generate projects for a collection microsite. Each template can be used
      to generate a project for all available volumes, without having to
      redefine the settings each time.
    </p>
    <p slot="guidance">
      After entering the core details below and clicking
      <strong>Create</strong>, you will be given access to futher options to
      help design the task, add filters, a tutorial and set the rules for
      results analysis.
    </p>
    <hr class="my-1">

    <pybossa-form
      submit-text="Create"
      :form="form"
      @success="onSuccess">
    </pybossa-form>

  </card-base>
</template>

<script>
import localConfig from '@/local.config'
import { metaTags } from '@/mixins/metaTags'
import { fetchAll } from '@/utils/fetchAll'
import CardBase from '@/components/cards/Base'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'admin-templates-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'New Template',
      description: 'Create a project template.',
      localConfig: localConfig
    }
  },

  asyncData ({ app, params, error, store }) {
    const tmplEndpoint = `/lc/users/${params.name}/templates`
    return Promise.all([
      fetchAll(app.$axios, 'category'),
      app.$axios.$get(tmplEndpoint)
    ]).then(([categoriesData, tmplData]) => {
      // Set default collection
      tmplData.form.category_id = categoriesData[0].id

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
                values: categoriesData,
                selectOptions: {
                  hideNoneSelectedText: true
                },
                hint: 'The collection microsite for the template.'
              },
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
                  'projects page.'
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

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    }
  },

  methods: {
    /**
     * Handle success.
     */
    onSuccess (data) {
      if (typeof data.next !== 'undefined') {
        const tmplId = data.next.split('templates/')[1]
        this.$router.push({
          name: 'admin-templates-id-task',
          params: {
            id: tmplId
          }
        })
      }
    }
  },

  beforeMount () {
    this.$store.dispatch('UPDATE_CURRENT_TEMPLATE', {})
  }
}
</script>
