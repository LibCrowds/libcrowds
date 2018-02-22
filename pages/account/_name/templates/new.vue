<template>
  <card-base :title="title" :description="description">

    <p slot="guidance">
      Project templates can be used by anyone to generate new projects for a
      collection microsite. For example, if you wanted to collect
      transcriptions of all song titles mentioned in a particular set of
      volumes you could create two templates, one to mark out those song
      titles followed by one to transcribe them.
    </p>
    <p slot="guidance">
      After entering the core details below and clicking
      <strong>Create</strong>, you will be given access to futher options to
      design your task, add tags, a tutorial and set the rules for results
      analysis.
    </p>

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
import CardBase from '@/components/cards/Base'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'templates-dashboard',

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
      app.$axios.$get('/api/category', {
        params: {
          limit: 100
        }
      }),
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
                values: store.state.publishedCollections,
                selectOptions: {
                  hideNoneSelectedText: true
                }
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
                placeholder: 'The description appears on the project cards ' +
                  'displayed on the main projects page'
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
          name: 'account-name-templates-id-task',
          params: {
            name: this.currentUser.name,
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
