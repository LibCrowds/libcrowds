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

      <div slot="top" class="form-group">
        <label>Template</label>
        <multiselect
          v-model="selectedTemplate"
          label="name"
          track-by="id"
          :options="templates"
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

      <div
        slot="bottom"
        v-if="hasTags"
        v-for="(tag, index) in currentCollection.info.tags"
        :key="index"
        class="form-group mb-2">
        <label>{{ tag.name | capitalize }}</label>
        <multiselect
          :id="tag.name"
          v-model="formModel.tags[tag.name]"
          :options="tagOptions[tag.name] || []"
          :taggable="true"
          @tag="addTag">
        </multiselect>
        <div class="hint">
          Add a "{{ tag.name }}" tag.
        </div>
      </div>

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
      localConfig: localConfig,
      selectedTemplate: {},
      selectedVolume: {},
      tagOptions: {},
      tags: {}
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

    availableVolumes () {
      const tmpl = this.templates.filter(tmpl => {
        return tmpl.id === this.formModel.template_id
      })[0] || null
      if (!tmpl) {
        return []
      }

      return this.volumes.filter(vol => {
        return tmpl.available_volumes.indexOf(vol.id) > -1
      })
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
    },

    hasTags () {
      return this.currentCollection.info.tags.length
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
      this.formModel.volume_id = null
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
     * Add a new tag.
     * @param {String} value
     *   The new tag value.
     * @param {String} name
     *   The tag name (from the multiselect id).
     */
    addTag (value, name) {
      if (Array.isArray(this.tagOptions[name])) {
        this.tagOptions[name].push(value)
      } else {
        this.tagOptions[name] = [value]
      }

      if (Array.isArray(this.formModel.tags[name])) {
        this.formModel.tags[name] = value
      } else {
        this.formModel.tags[name] = value
      }
    }
  },

  beforeMount () {
    this.$store.dispatch('UPDATE_CURRENT_PROJECT', {})
  },

  mounted () {
    // Get tags for the collection.
    const endpoint = `/lc/categories/${this.currentCollection.short_name}/tags`
    return this.$axios.$get(endpoint).then(data => {
      this.tagOptions = data.tags
    }).catch(err => {
      this.$nuxt.error(err)
    })
  }
}
</script>
