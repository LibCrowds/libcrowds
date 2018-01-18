<template>
  <card-base :title="title" :description="description">
    <b-tabs small card v-model="tabIndex">

      <!-- Template selection tab -->
      <b-tab title="Template" no-body>
        <b-card-body>
          <p class="lead mb-1">
            Choose the project template
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
            section.
          </p>
        </b-card-body>
        <b-table
          responsive
          striped
          hover
          show-empty
          class="border-left-0 border-right-0 border-bottom-0"
          :items="availableTemplates"
          :fields="templateTableFields">
          <template slot="actions" scope="tmpl">
            <b-btn
              variant="success"
              class="m-1"
              size="sm"
              :disabled="form.model.template_id == tmpl.item.id"
              @click="selectTemplate(tmpl.item.id)">
              Select
            </b-btn>
            <b-btn
              variant="info"
              class="m-1"
              size="sm"
              @click.stop="tmpl.toggleDetails">
              {{ tmpl.detailsShowing ? 'Hide' : 'Show' }} Details
            </b-btn>
          </template>
          <template slot="row-details" scope="tmpl">
            <b-card>
              <h5>Project Details</h5>
              <ul class="list-unstyled">
                <li v-for="key in Object.keys(tmpl.item.project)" :key="key">
                  <strong>{{ key }}:</strong>
                  {{ tmpl.item.project[key] }}
                </li>
                <h5 class="mt-3">Task Details</h5>
                <li v-for="key in Object.keys(tmpl.item.task)" :key="key">
                  <strong>{{ key }}:</strong>
                  <template v-if="key === 'fields_schema'">
                    <ul>
                      <li
                        v-for="field in tmpl.item.task[key]"
                        :key="field">
                        <strong>{{ field.model }}:</strong>
                        <ul>
                          <li
                            v-for="fieldKey in Object.keys(field)"
                            :key="fieldKey">
                            <strong>{{ fieldKey }}:</strong>
                            {{ field[fieldKey] }}
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </template>
                  <template v-else-if="key === 'institutions'">
                    <ul>
                      <li
                        v-for="code in tmpl.item.task[key]"
                        :key="code">
                        {{ code }}
                      </li>
                    </ul>
                  </template>
                  <template v-else>
                    {{ tmpl.item.task[key] }}
                  </template>
                </li>
                <h5 class="mt-3">Analysis Details</h5>
                <template v-if="tmpl.item.rules">
                  <li
                    v-for="key in Object.keys(tmpl.item.rules)"
                    :key="key">
                    <strong>{{ key }}:</strong>
                    {{ tmpl.item.rules[key] }}
                  </li>
                </template>
                <template v-else>
                  <li>None</li>
                </template>
              </ul>
            </b-card>
          </template>
        </b-table>
      </b-tab>

      <!-- Volume selection tab -->
      <b-tab title="Volume" no-body>
        <b-card-body>
          <p class="lead">
            Choose the volume
          </p>
          <p>
            If the volume that you want to create your project from is not
            listed, please get in touch by clicking the email button at the
            bottom of this page.
          </p>
        </b-card-body>
        <b-table
          responsive
          striped
          hover
          show-empty
          class="border-left-0 border-right-0 border-bottom-0"
          :items="availableVolumes"
          :fields="volumeTableFields">
          <template slot="thumbnail" scope="volume">
            <small-avatar
              class="mx-auto"
              :info="volume.item">
            </small-avatar>
          </template>
          <template slot="source" scope="volume">
            <a :href="volume.item.source" target="_blank">
              {{ volume.item.source }}
            </a>
          </template>
          <template slot="actions" scope="volume">
            <b-btn
              variant="success"
              size="sm"
              :disabled="form.model.volume_id == volume.item.id"
              @click="selectVolume(volume.item.id)">
              Select
            </b-btn>
          </template>
        </b-table>
      </b-tab>

      <b-tab title="Parent" no-body>
        <b-card-body>
          <p class="lead">
            Choose a parent project
          </p>
          <p>
            Choose a parent project that should be used to generate the tasks
            for the new project. For example, you may want to generate a
            transcription project from a the results of a previous marking
            project.
          </p>
        </b-card-body>
        <projects-table
          no-border
          :collection="collection">
          <template slot="action" scope="project">
            <b-btn
              variant="success"
              size="sm"
              @click="selectParent(project.item.id)"
              :disabled="form.model.parent_id == project.item.id">
              Select
            </b-btn>
          </template>
        </projects-table>
      </b-tab>

      <b-tab title="Confirm" no-body>
        <b-card-body>
          <ul class="list-unstyled" v-if="canCreate">
            <li class="mb-1">
              <strong>Collection:</strong>
              {{ collection.name }}
            </li>
            <li class="mb-1">
              <strong>Template:</strong>
              {{ getSelectedItem(templates, form.model.template_id) }}
            </li>
            <li class="mb-1">
              <strong>Volume:</strong>
              {{ getSelectedItem(volumes, form.model.volume_id) }}
            </li>
            <li class="mb-1">
              <strong>Parent:</strong>
              {{ form.model.parent_id }}
            </li>
          </ul>
          <b-alert v-else show variant="primary">
            To confirm project creation please select a volume and template.
          </b-alert>
        </b-card-body>
      </b-tab>

    </b-tabs>

    <b-card-footer>
      <span class="float-right">
        <b-btn
          variant="dark"
          class="mr-1"
          :exact="true"
          :to="{
            name: 'admin-project-new'
          }">
          Cancel
        </b-btn>
        <b-btn
          variant="dark"
          :disabled="tabIndex === 0"
          class="mr-1"
          @click="tabIndex--">
          Previous
        </b-btn>
        <b-btn
          variant="dark"
          :disabled="tabIndex >= 3"
          class="mr-1"
          @click="tabIndex++">
          Next
        </b-btn>
        <b-btn
          variant="success"
          :disabled="!canCreate"
          @click="createProject">
          Create
        </b-btn>
      </span>
    </b-card-footer>

  </card-base>
</template>

<script>
import capitalize from 'capitalize'
import isEmpty from 'lodash/isEmpty'
import localConfig from '@/local.config.js'
import { notifications } from '@/mixins/notifications'
import { metaTags } from '@/mixins/metaTags'
import PybossaForm from '@/components/forms/PybossaForm'
import CardBase from '@/components/cards/Base'
import SmallAvatar from '@/components/avatars/Small'
import InfiniteLoadingTable from '@/components/tables/InfiniteLoading'
import ProjectsTable from '@/components/tables/Projects'

export default {
  layout: 'admin-project-dashboard',

  mixins: [ notifications, metaTags ],

  data () {
    return {
      tabIndex: 0,
      localConfig: localConfig,
      templateTableFields: {
        name: {
          label: 'Name',
          sortable: true
        },
        actions: {
          label: 'Actions',
          class: 'text-center'
        }
      },
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
      shortnameValid: false,
      generating: false
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
        templates: data.templates,
        volumes: data.volumes,
        form: {
          endpoint: endpoint,
          method: 'post',
          model: data.form,
          schema: {
            fields: [] // Tables used instead
          }
        }
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
    SmallAvatar
  },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    },

    currentUser () {
      return this.$store.state.currentUser
    },

    canCreate () {
      console.log(this.form.model, this.generating)
      return (
        !isEmpty(this.form.model.template_id) &&
        !isEmpty(this.form.model.volume_id) &&
        !this.generating
      )
    },

    title () {
      return `New ${this.collection.name} Project`
    },

    description () {
      return `Create a new ${this.collection.name} project`
    }
  },

  methods: {
    /**
     * Select a template.
     * @param {String} id
     *   The template ID.
     */
    selectTemplate (id) {
      this.form.model.template_id = id
      this.tabIndex++
      this.highlightSelectedRows()
    },

    /**
     * Select a volume.
     * @param {String} id
     *   The volume ID.
     */
    selectVolume (id) {
      this.form.model.volume_id = id
      this.tabIndex++
      this.highlightSelectedRows()
    },

    /**
     * Select a parent.
     * @param {String} id
     *   The project ID.
     */
    selectParent (id) {
      this.form.model.parent_id = id
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
     * Return item in an array selected by ID.
     * @param {Array} arr
     *   The array.
     * @param {Array} id
     *   The ID.
     */
    getSelectedItem (arr, id) {
      const filtered = arr.filter(item => {
        return item.id === id
      })
      if (filtered.length) {
        return filtered[0]
      }
    },

    /**
     * List the available templates.
     */
    availableTemplates () {
      return this.templates.map(tmpl => {
        tmpl.name = tmpl.project.name
        return tmpl
      })
    },

    /**
     * List the available volumes.
     */
    availableVolumes () {
      return this.volumes
    },

    /**
     * Create a project.
     */
    createProject () {
      this.$swal({
        title: `Confirm`,
        html: `You're about to create and publish a ${this.collection.name}
          project.
          <br><br>Click OK to continue.`,
        type: 'question',
        showCancelButton: true,
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          this.generating = true
          return this.$axios.$post(this.endpoint, this.form.model)
        }
      }).then(data => {
        this.generating = false
        let text = data.flash
        this.$swal({
          title: capitalize(data.status),
          html: text,
          type: data.status
        })
      })
    }
  },

  beforeMount () {
    this.$store.dispatch('UPDATE_CURRENT_PROJECT', {})
  }
}
</script>
