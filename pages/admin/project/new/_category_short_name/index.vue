<template>
  <card-base :title="title" :description="description">
    <b-tabs small card v-model="tabIndex" @input="onTabsChange">

      <!-- Template selection tab -->
      <b-tab title="Template" no-body>
        <b-card-body>
          <p class="lead mb-1">
            Choose a project template
          </p>
          <p>
            Project templates provide the configuration details for a
            particular task. For example, a template might be created to
            transcribe all of the titles shown in an image. Each template can
            be used to generate a similar project for multiple volumes (the
            volume is chosen in the next section).
          </p>
          <p>
            If you can't find a suitable template you can create your own by
            visiting the
            <nuxt-link
              :to="{
                name: 'account-name-templates-new',
                params: {
                  name: currentUser.name
                }
              }">
              New Template
            </nuxt-link>
            section, or
            <a :href="`mailto:${localConfig.email}`">get in touch</a> and let
            us know how we can help.
          </p>
          <p>
            Choose a template by locating it in the list below and clicking
            <strong>Select</strong>.
          </p>
        </b-card-body>
        <templates-table
          show-details
          :templates="templates">
          <template slot="action" scope="tmpl">
            <b-btn
              variant="success"
              class="m-1"
              size="sm"
              :disabled="form.model.template_id == tmpl.item.id"
              @click="selectTemplate(tmpl.item)">
              Select
            </b-btn>
          </template>
        </templates-table>
      </b-tab>

      <!-- Volume selection tab -->
      <b-tab title="Volume" no-body>
        <b-card-body>
          <p class="lead">
            Choose a volume
          </p>
          <p>
            Volumes provide the input for a project (e.g. the images). The
            available volumes for a collection are maintained by
            administrators. If the volume that you want to create your project
            from is not listed here, please
            <a :href="`mailto:${localConfig.email}`">get in touch</a> and we
            will see if it can be made available.
          </p>
          <p>
            Note that volumes for which a project has already been built from
            the selected template are excluded from this list.
          </p>
          <p>
            Choose a volume by locating it in the list below and clicking
            <strong>Select</strong>.
          </p>
        </b-card-body>
        <volumes-table :volumes="availableVolumes">
          <template slot="action" scope="volume">
            <b-btn
              variant="success"
              size="sm"
              :disabled="form.model.volume_id == volume.item.id"
              @click="selectVolume(volume.item)">
              Select
            </b-btn>
          </template>
        </volumes-table>
      </b-tab>

      <!-- Parent selection tab -->
      <b-tab title="Parent" no-body>
        <b-card-body v-if="collection.info.presenter === 'iiif-annotation'">
          <p class="lead">
            Choose a parent project
          </p>
          <p>
            IIIF Annotation projects can be built from an optional parent
            project. When a project is built from a parent, a task will be
            generated for each result that was produced by that parent.
            For example, the parent project might contain tasks to mark up all
            titles in a volume. The  child project containing tasks to
            transcribe all of those titles.
          </p>
          <p>
            If you are unsure about this stage,
            please <a :href="`mailto:${localConfig.email}`">get in touch</a>
            and we will be happy to help.
          </p>
          <p>
            Choose a parent project by locating it in the list below and
            clicking <strong>Select</strong>. Note that only completed projects
            are shown.
          </p>
        </b-card-body>
        <projects-table
          ref="projects-table"
          filter="100"
          filter-by="overall_progress"
          :collection="collection">
          <template slot="action" scope="project">
            <b-btn
              variant="success"
              size="sm"
              @click="selectParent(project.item)"
              :disabled="form.model.parent_id == project.item.id">
              Select
            </b-btn>
          </template>
        </projects-table>
      </b-tab>

      <!-- Confirmation tab -->
      <b-tab title="Confirm" no-body>
        <b-card-body>
          <p class="lead">
            Confirm
          </p>
          <p>
            The final stage is to select a name and short name for your
            project. These will be prefilled according to the template and
            volume that you have selected. If you have not selected a template
            or volume, please navigate back to the relevant tables using the
            tabs above.
          </p>
          <p class="mb-0">
            Please review the details below, then click
            <strong>Create</strong>.
          </p>
        </b-card-body>
        <pybossa-form
          :confirmation="confirmation"
          submit-text="Create"
          :form="form">
        </pybossa-form>
      </b-tab>
    </b-tabs>

  </card-base>
</template>

<script>
import localConfig from '@/local.config.js'
import { notifications } from '@/mixins/notifications'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import SmallAvatar from '@/components/avatars/Small'
import InfiniteLoadingTable from '@/components/tables/InfiniteLoading'
import ProjectsTable from '@/components/tables/Projects'
import TemplatesTable from '@/components/tables/Templates'
import VolumesTable from '@/components/tables/Volumes'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'admin-project-dashboard',

  mixins: [ notifications, metaTags ],

  data () {
    return {
      tabIndex: 0,
      localConfig: localConfig,
      volumeTableFields: {
        thumbnail: {
          label: 'Thumbnail',
          class: 'text-center'
        },
        name: {
          label: 'Name',
          sortable: true
        },
        source: {
          label: 'Source',
          sortable: true
        },
        actions: {
          label: 'Actions',
          class: 'text-center'
        }
      },
      existingProjectDetails: {},
      shortnameValid: false
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
    const endpoint = `/libcrowds/projects/${params.category_short_name}/new`
    return app.$axios.$get(endpoint).then(data => {
      return {
        endpoint: endpoint,
        templates: data.templates.map(tmpl => {
          tmpl.name = tmpl.project.name
          tmpl._showDetails = false
          return tmpl
        }),
        volumes: data.volumes.map(vol => {
          vol._showDetails = false
          return vol
        }),
        form: {
          endpoint: endpoint,
          method: 'post',
          model: data.form,
          schema: {
            fields: [
              {
                type: 'input',
                inputType: 'text',
                label: 'Name',
                model: 'name',
                placeholder: 'Your Project Name',
                hint: 'The project name is used in any tables project cards ' +
                  'presented to users.'
              },
              {
                type: 'input',
                inputType: 'text',
                label: 'Short name',
                model: 'short_name',
                placeholder: 'your_project_name',
                hint: 'The short name is used to form some URLs and the ' +
                  'names of any downloadable files.'
              },
              {
                type: 'select',
                label: 'Template',
                model: 'template_id',
                disabled: true,
                values: [], // Add dynamically
                hint: 'Templates provide the task configuration details,' +
                  ' click the Template tab to update.'
              },
              {
                type: 'select',
                label: 'Volume',
                model: 'volume_id',
                disabled: true,
                values: [], // Add dynamically
                hint: 'Volumes provide the input for a project, click the ' +
                  'Volume tab to update.'
              },
              {
                type: 'select',
                label: 'Parent Project',
                model: 'parent_id',
                disabled: true,
                values: [], // Add dynamically
                hint: 'Parent projects influence how tasks are generated,' +
                  ' click the Parent tab to update.'
              }
            ]
          }
        },
        built_templates: data.built_templates
      }
    }).catch(err => {
      error(err)
    })
  },

  components: {
    PybossaForm,
    CardBase,
    InfiniteLoadingTable,
    ProjectsTable,
    SmallAvatar,
    TemplatesTable,
    VolumesTable
  },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    },

    currentUser () {
      return this.$store.state.currentUser
    },

    title () {
      return `New ${this.collection.name} Project`
    },

    description () {
      return `Create a new ${this.collection.name} project`
    },

    confirmation () {
      return `You're about to create a project for ${this.collection.name}.
        <br><br>The project will be created in draft mode and will be
        published once approved by a LibCrowds administrator. You will recieve
        an email once this process is complete.
        <br><br>Click OK to continue.`
    },

    availableVolumes () {
      const tmplId = this.form.model.template_id
      const built = tmplId in this.built_templates
        ? this.built_templates[tmplId]
        : []

      // List the available volumes for the selected template.
      return this.volumes.filter(vol => {
        return built.indexOf(vol.id) < 0
      })
    }
  },

  methods: {
    /**
     * Select a template.
     * @param {Object} template
     *   The template.
     */
    selectTemplate (template) {
      const fieldsClone = JSON.parse(JSON.stringify(this.form.schema.fields))
      this.form.schema.fields = fieldsClone.map(field => {
        if (field.model === 'template_id') {
          field.values = [{ id: template.id, name: template.project.name }]
        } else if (field.model === 'volume_id') {
          field.values = []
        }
        return field
      })
      this.form.model.template_id = template.id
      this.form.model.volume_id = null
      this.tabIndex++
      this.setNameAndShortName()
      this.highlightSelectedRows()
    },

    /**
     * Select a volume.
     * @param {Object} volume
     *   The volume.
     */
    selectVolume (volume) {
      const fieldsClone = JSON.parse(JSON.stringify(this.form.schema.fields))
      this.form.schema.fields = fieldsClone.map(field => {
        if (field.model === 'volume_id') {
          field.values = [{ id: volume.id, name: volume.name }]
        }
        return field
      })
      this.form.model.volume_id = volume.id
      this.tabIndex++
      this.setNameAndShortName()
      this.highlightSelectedRows()
    },

    /**
     * Select a parent project
     * @param {Object} project
     *   The project.
     */
    selectParent (project) {
      const fieldsClone = JSON.parse(JSON.stringify(this.form.schema.fields))
      this.form.schema.fields = fieldsClone.map(field => {
        if (field.model === 'parent_id') {
          field.values = [{ id: parent.id, name: parent.name }]
        }
        return field
      })
      this.form.model.parent_id = project.id
      this.tabIndex++
      this.highlightSelectedRows()
    },

    /**
     * Highlight the selected rows.
     */
    highlightSelectedRows () {
      this.templates.map(tmpl => {
        delete tmpl._rowVariant
        if (tmpl.id === this.form.model.template_id) {
          tmpl._rowVariant = 'success'
        }
        return tmpl
      })
      this.volumes.map(vol => {
        delete vol._rowVariant
        if (vol.id === this.form.model.volume_id) {
          vol._rowVariant = 'success'
        }
        return vol
      })
    },

    /**
     * Pre-fill the name and short name.
     */
    setNameAndShortName () {
      const tmplField = this.form.schema.fields.filter(field => {
        return field.model === 'template_id'
      })[0]
      const volField = this.form.schema.fields.filter(field => {
        return field.model === 'volume_id'
      })[0]
      const tmplName = tmplField.values.length ? tmplField.values[0].name : ''
      const volName = volField.values.length ? volField.values[0].name : ''
      const name = `${tmplName}: ${volName}`
      const re = /([$#%·:,.~!¡?"¿'=)(!&/|]+)/g
      const sn = name.replace(re, '').toLowerCase().trim().replace(' ', '_')
      this.form.model.name = name
      this.form.model.short_name = sn
    },

    /**
     * Handle tabs being changed.
     */
    onTabsChange () {
      this.filter = null
      const table = this.$refs['projects-table']
      if (typeof table !== 'undefined') {
        table.reset()
      }
    }
  },

  beforeMount () {
    this.$store.dispatch('UPDATE_CURRENT_PROJECT', {})
  }
}
</script>
