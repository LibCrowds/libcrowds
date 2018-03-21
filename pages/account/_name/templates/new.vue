<template>
  <card-base :title="title" :description="description">
    <p slot="guidance">
      Project templates can be used by anyone to generate projects for a
      collection microsite. For example, if you wanted to collect
      transcriptions of all song titles mentioned in a particular set of
      volumes you could create two templates, one to mark out those song
      titles followed by one to transcribe them. These templates could then
      be used for any number of volumes belonging to the collection microsite.
    </p>
    <p slot="guidance">
      After entering the core details below and clicking
      <strong>Create</strong>, you will be given access to futher options to
      help design your task, add tags, a tutorial and set the rules for
      results analysis.
    </p>

    <hr>

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
          limit: 100,
          orderby: 'created',
          desc: 1
        }
      }),
      app.$axios.$get(tmplEndpoint)
    ]).then(([categoriesData, tmplData]) => {
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
          name: 'account-name-templates-id-task',
          params: {
            name: this.currentUser.name,
            id: tmplId
          }
        })
      }
      this.$store.dispatch('UPDATE_N_PENDING_TEMPLATES', this.$axios)
    }
  },

  beforeMount () {
    this.$store.dispatch('UPDATE_CURRENT_TEMPLATE', {})
  }
}
</script>
