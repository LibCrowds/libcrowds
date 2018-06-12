<template>
  <card-base
    :title="title"
    :description="description"
    docs="/projects/new/">
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
      One project can be built for each combination of template and volume.
      Only the available volumes for the selected template will be shown.
    </p>
    <p slot="guidance">
      The available templates and volumes for each collection are maintained
      by {{ localConfig.brand }} administrators.
    </p>
    <hr class="my-1">

    <pybossa-form
      :confirmation="confirmation"
      submit-text="Create"
      :form="form"
      @success="onSuccess">

      <div slot="top" class="form-group">
        <label>Template</label>
        <multiselect
          v-model="selectedTemplate"
          label="name"
          track-by="id"
          :options="availableTemplates"
          @input="selectTemplate">
        </multiselect>
        <div class="hint">
          The template provides the task configuration details.
        </div>
      </div>

      <div slot="top" class="form-group">
        <label>Volume</label>
        <multiselect
          v-model="selectedVolume"
          label="name"
          track-by="id"
          :options="availableVolumes"
          @input="selectVolume">
        </multiselect>
        <div class="hint">
          The volume provides the input source.
        </div>
      </div>

    </pybossa-form>

  </card-base>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
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
      localConfig: localConfig,
      selectedTemplate: {},
      selectedVolume: {}
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
        built_projects: data.built_projects
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
    title () {
      return `New ${this.currentCollection.name} Project`
    },

    description () {
      return `Create a new ${this.currentCollection.name} project`
    },

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

    availableTemplates () {
      return this.currentCollection.info.templates.filter(tmpl => {
        // Check if project built with parent template is complete
        if (
          tmpl.parent_template_id &&
          !this.isParentAvailable(tmpl.parent_template_id)
        ) {
          return false
        }

        // Check if the template is available for the selected volume
        if (!isEmpty(this.selectedVolume)) {
          return this.isComboAvailable(tmpl, this.selectedVolume)
        }

        // Check if the collection has a volume not used by this template
        for (let vol of this.currentCollection.info.volumes) {
          if (this.isComboAvailable(tmpl, vol)) {
            return true
          }
        }
        return false
      })
    },

    availableVolumes () {
      return this.currentCollection.info.volumes.filter(vol => {
        // Check if the volume is available for the selected template
        if (!isEmpty(this.selectedTemplate)) {
          return this.isComboAvailable(this.selectedTemplate, vol)
        }

        // Check if the collection has a template not used by this volume
        for (let tmpl of this.currentCollection.info.templates) {
          if (this.isComboAvailable(tmpl, vol)) {
            return true
          }
        }
        return false
      })
    },

    confirmation () {
      return `You're about to create a project for
        ${this.currentCollection.name}.
        <br><br>Once generated, you will be redirected to a settings
        page where you can set some filters for the project.
        <br><br>Click OK to continue.`
    }
  },

  methods: {
    /**
     * Select a template.
     * @param {Object} tmpl
     *   The template.
     */
    selectTemplate (tmpl) {
      this.formModel.template_id = tmpl.id
      this.setNameAndShortName()
    },

    /**
     * Select a volume.
     * @param {Object} volume
     *   The volume.
     */
    selectVolume (volume) {
      this.formModel.volume_id = volume.id
      this.setNameAndShortName()
    },

    /**
     * Pre-fill the name and short name.
     */
    setNameAndShortName () {
      const tmplName = this.selectedTemplate.name || ''
      const volName = this.selectedVolume.name || ''
      const name = `${tmplName}: ${volName}`
      this.formModel.name = name
      this.formModel.short_name = this.getShortname(name)
    },

    /**
     * Check if a combination of template and volume is available.
     * @param {Object} template
     *   The template
     * @param {Object} volume
     *   The volume
     */
    isComboAvailable (template, volume) {
      for (let builtItem of this.built_projects) {
        if (
          builtItem.template_id === template.id &&
          builtItem.volume_id === volume.id
        ) {
          return false
        }
      }
      return true
    },

    /**
     * Check if a parent template is linked to a completed project.
     * @param {Object} templateId
     *   The template ID.
     */
    isParentAvailable (templateId) {
      for (let builtItem of this.built_projects) {
        if (
          builtItem.template_id === templateId &&
          builtItem.overall_progress === 100 &&
          builtItem.empty_results === 0
        ) {
          return true
        }
      }
      return false
    },

    /**
     * Handle form success.
     */
    onSuccess (data) {
      this.$router.push({
        name: 'admin-project-short_name-filters',
        params: {
          short_name: data.form.short_name
        }
      })
    }
  },

  beforeMount () {
    this.$store.dispatch('UPDATE_CURRENT_PROJECT', {})
  }
}
</script>