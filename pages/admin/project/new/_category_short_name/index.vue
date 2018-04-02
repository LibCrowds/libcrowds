<template>
  <card-base :title="title" :description="description">
    <p slot="guidance">
      Use the form below to create a project from a chosen template and volume.
    </p>
    <p slot="guidance">
      Project templates provide all of the configuration details for a
      particular task. For example, a template might be created to
      transcribe all of the titles shown in an image.
    </p>
    <p slot="guidance">
      Volumes provide the input source for a project (e.g. the images).
      The available volumes for each collection are maintained by
      {{ localConfig.brand }} administrators. One project can be built
      for each combination of template and volume. Only the available
      volumes for the selected template will be shown.
    </p>
    <hr class="my-1">

    <pybossa-form
      :confirmation="confirmation"
      submit-text="Create"
      :form="form">
    </pybossa-form>

  </card-base>
</template>

<script>
import localConfig from '@/local.config.js'
import { metaTags } from '@/mixins/metaTags'
import { getShortname } from '@/mixins/getShortname'
import CardBase from '@/components/cards/Base'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'admin-project-dashboard',

  mixins: [ metaTags, getShortname ],

  data () {
    return {
      localConfig: localConfig
    }
  },

  fetch ({ params, app, error, store }) {
    return app.$axios.$get('/api/category', {
      params: {
        short_name: params.category_short_name
      }
    }).then(data => {
      if (!data || data.length !== 1) {
        error({ statusCode: 404 })
        return
      }
      store.dispatch('UPDATE_CURRENT_COLLECTION', data[0])
    }).catch(err => {
      error(err)
    })
  },

  asyncData ({ app, params, error }) {
    const endpoint = `/lc/projects/${params.category_short_name}/new`
    return app.$axios.$get(endpoint).then(data => {
      return {
        endpoint: endpoint,
        formModel: data.form,
        templates: data.templates,
        volumes: data.volumes
      }
    }).catch(err => {
      error(err)
    })
  },

  components: {
    PybossaForm,
    CardBase
  },

  computed: {
    currentCollection () {
      return this.$store.state.currentCollection
    },

    form () {
      return {
        endpoint: this.endpoint,
        method: 'post',
        model: this.formModel,
        schema: {
          fields: [
            {
              type: 'select',
              label: 'Template',
              model: 'template_id',
              values: this.templates,
              hint: 'The template provides the task configuration details.',
              onChanged: this.setNameAndShortName
            },
            {
              type: 'select',
              label: 'Volume',
              model: 'volume_id',
              values: (model) => {
                const filteredTemplates = this.templates.filter(tmpl => {
                  return tmpl.id === model.template_id
                })
                if (filteredTemplates.length < 1) {
                  return []
                }
                const tmpl = filteredTemplates[0]
                return this.volumes.filter(vol => {
                  return tmpl.available_volumes.indexOf(vol.id) > -1
                })
              },
              hint: 'The volume provides the input source.',
              onChanged: this.setNameAndShortName
            },
            {
              type: 'input',
              inputType: 'text',
              label: 'Name',
              model: 'name',
              readonly: true,
              placeholder: 'Your Project Name',
              hint: 'The name of the project (generated according to the ' +
                'chosen template and volume).'
            },
            {
              type: 'input',
              inputType: 'text',
              label: 'Short name',
              model: 'short_name',
              readonly: true,
              placeholder: 'your_project_name',
              hint: 'An identifier used, for example, in the names of any ' +
                'downloadable files (generated according to the ' +
                'chosen template and volume).'
            }
          ]
        }
      }
    },

    title () {
      return `New ${this.currentCollection.name} Project`
    },

    description () {
      return `Create a new ${this.currentCollection.name} project`
    },

    confirmation () {
      let msg = `You're about to create a project for
        ${this.currentCollection.name}.`

      // Add building from parent message, if applicable
      const tmpl = this.templates.filter(tmpl => {
        return tmpl.id === this.formModel.template_id
      })[0] || {}
      if (tmpl.parent_template_id) {
        const parentTmpl = this.templates.filter(parentTmpl => {
          return parentTmpl.id === tmpl.parent_template_id
        })[0] || 'Unknown'
        msg += `<br><br>Note that this project will be built from the
          "${parentTmpl.name}" parent of the same volume.`
      }

      msg += '<br><br>Click OK to continue.'
      return msg
    }
  },

  methods: {
    /**
     * Pre-fill the name and short name.
     */
    setNameAndShortName () {
      const tmpl = this.templates.filter(tmpl => {
        return tmpl.id === this.formModel.template_id
      })[0] || null
      const tmplName = tmpl ? tmpl.name : ''

      const vol = this.volumes.filter(vol => {
        return vol.id === this.formModel.volume_id
      })[0] || null
      const volName = vol ? vol.name : ''

      const name = `${tmplName}: ${volName}`
      this.formModel.name = name
      this.formModel.short_name = this.getShortname(name)
    }
  },

  beforeMount () {
    this.$store.dispatch('UPDATE_CURRENT_PROJECT', {})
  }
}
</script>
