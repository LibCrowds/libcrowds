<template>
  <card-base :title="title" :description="description">
    <b-tabs small card v-model="tabIndex">
      <b-tab title="Introduction">
        <b-card-body>
          <p>
            The following pages contain a series of options for generating a
            new project from a template.
          </p>
          <p>
            Once the project has been created you will be given access to
            additional options including those to tweak help text or add tags
            to make the project easier to find.
          </p>
          <p>
            The templates are maintained by {{ localConfig.brand }}
            administrators. This is partly for quality control and partly so
            that it's easier for future projects to be generated and organised.
            Similarly, you will be asked to choose the volume that contains
            the input for the project (e.g. the images). These volumes are also
            maintained by {{ localConfig.brand }} administrators. If you can't
            find a suitable template or volume for the type of project that
            you would like to create please get in touch by clicking the email
            icon below. We can then help you to locate the items you're after
            or to design the required templates.
          </p>
          <p>
            When you're ready to begin click the <strong>Next</strong> button
            at the bottom of this page.
          </p>
        </b-card-body>
      </b-tab>

      <b-tab title="Collection">
        <b-card-body>
          <p class="lead">
            Choose a collection microsite
          </p>
          <p>
            As the project templates for each collection microsite are
            different, let's start by choosing the microsite that the project
            should appear on.
          </p>
        </b-card-body>
        <infinite-loading-table
          v-if="tabIndex === 1"
          no-border
          :fields="tableFields"
          domain-object="category">
          <template slot="action" scope="collection">
            <b-btn
              variant="success"
              size="sm"
              @click="selectItem('collection', collection.item)"
              :disabled="selected['collection'].id == collection.item.id">
              Select
            </b-btn>
          </template>
        </infinite-loading-table>
      </b-tab>

      <b-tab title="Template">
        <b-card-body>
          <p class="lead mb-1">
            Choose the project template
          </p>
          <p>
            If you can't find a suitable template for the type of project
            that you want to create please get in touch by clicking the email
            button at the bottom of this page.
          </p>
        </b-card-body>
        <b-table
          v-if="selected['collection'].id"
          responsive
          striped
          hover
          show-empty
          class="border-left-0 border-right-0 border-bottom-0"
          :items="availableCollectionItems('templates')"
          :fields="tableFields">
          <template slot="actions" scope="template">
            <b-btn
              variant="success"
              size="sm"
              :disabled="selected['template'].name == template.item.name"
              @click="selectItem('template', template.item)">
              Select
            </b-btn>
          </template>
        </b-table>
        <b-card-body class="pt-0" v-else>
          <b-alert show variant="primary">
            Choose a collection to see the available templates.
          </b-alert>
        </b-card-body>
      </b-tab>

      <b-tab title="Volume">
        <b-card-body>
          <p class="lead">
            Choose the source volume
          </p>
          <p>
            If the volume that you want to create your project from is not
            listed please get in touch by clicking the email button at the
            bottom of this page.
          </p>
        </b-card-body>
        <b-table
          v-if="selected['collection'].id"
          responsive
          striped
          hover
          show-empty
          class="border-left-0 border-right-0 border-bottom-0"
          :items="availableCollectionItems('volumes')"
          :fields="tableFields">
          <template slot="actions" scope="volume">
            <b-btn
              variant="success"
              size="sm"
              :disabled="selected['volume'].source == volume.item.source"
              @click="selectItem('volume', volume.item)">
              Select
            </b-btn>
          </template>
        </b-table>
        <b-card-body class="pt-0" v-else>
          <b-alert show variant="primary">
            Choose a collection to see the available volumes.
          </b-alert>
        </b-card-body>
      </b-tab>

      <b-tab title="Tags">
        <b-card-body>
          <p class="lead">
            Choose the project tags
          </p>
          <p>
            If the tags that you want to add aren't listed please get in touch
            by clicking the email button at the bottom of this page.
          </p>
        </b-card-body>
        <b-card-body v-if="selected['collection'].id" class="pt-0">
          <div
            v-for="(value, tag) in selected['collection'].info.tags"
            :key="tag"
            zclass="mb-2">
            <label>{{ tag | capitalize }}</label>
            <multiselect
              placeholder="Select one"
              v-model="selected['tags'][tag]"
              :options="value.options">
            </multiselect>
          </div>
        </b-card-body>
        <b-card-body class="pt-0" v-else>
          <b-alert show variant="primary">
            Choose a collection to see the available tags.
          </b-alert>
        </b-card-body>
      </b-tab>

      <b-tab title="Confirm">
        <b-card-body>
          <ul class="list-unstyled" v-if="canCreate">
            <li class="mb-1">
              <strong>Collection:</strong>
              {{ selected['collection'].name }}
            </li>
            <li class="mb-1">
              <strong>Template:</strong>
              {{ selected['template'].name }}
            </li>
            <li class="mb-1">
              <strong>Volume:</strong>
              {{ selected['volume'].name }}
            </li>
            <li class="d-inline-flex mb-1">
              <strong class="mr-1">Tags:</strong>
              <project-tags-list
                disabled
                :tags="selected['tags']"
                :collection="selected['collection']">
              </project-tags-list>
            </li>
          </ul>
          <b-alert v-else-if="!selectionsComplete" show variant="primary">
            To confirm project creation select a collection, volume and
            template.
          </b-alert>
          <b-alert v-else show variant="primary">
            <p>
              A similar project was detected, which usually means that a
              project has previously been generated from the same volume and
              template.
            </p>
            <p>
              Please check the project linked to below and either delete it,
              update it's short name, or generate your new project from a
              different volume or template (recommended).
            </p>
            <nuxt-link :to="{
              name: 'admin-project-short_name-details',
              params: {
                short_name: existingProjectDetails.short_name
              }
            }">
            {{ existingProjectDetails.name }}
            </nuxt-link>
          </b-alert>
        </b-card-body>
      </b-tab>

    </b-tabs>

    <b-card-footer>
      <span class="float-right">
        <b-btn
          variant="dark"
          :disabled="tabIndex === 0"
          class="mr-1"
          @click="tabIndex--">
          Previous
        </b-btn>
        <b-btn
          variant="dark"
          :disabled="tabIndex >= 5"
          class="mr-1"
          @click="tabIndex++">
          Next
        </b-btn>
        <b-btn
          variant="success"
          :disabled="!canCreate || processing"
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
import InfiniteLoadingTable from '@/components/tables/InfiniteLoading'
import ProjectTagsList from '@/components/lists/ProjectTags'

export default {
  layout: 'admin-project-dashboard',

  mixins: [ notifications, metaTags ],

  data () {
    return {
      title: 'New Project',
      description: 'Create a new project',
      tabIndex: 0,
      localConfig: localConfig,
      selected: {
        'collection': {},
        'template': {},
        'volume': {},
        'tags': {}
      },
      tableFields: {
        name: {
          label: 'Name',
          sortable: true
        },
        actions: {
          label: 'Actions',
          class: 'text-center'
        }
      },
      existingProjectDetails: {},
      shortnameValid: false,
      processing: false
    }
  },

  components: {
    PybossaForm,
    CardBase,
    InfiniteLoadingTable,
    ProjectTagsList
  },

  computed: {
    selectionsComplete () {
      return Object.keys(this.selected).every(key => {
        if (key === 'tags') {
          return true
        }
        return !isEmpty(this.selected[key])
      })
    },

    canCreate () {
      return this.selectionsComplete && this.shortnameValid
    }
  },

  methods: {
    /**
     * Handle selection of an item.
     * @param {String} key
     *   The item key.
     * @param {Object} item
     *   The item.
     */
    selectItem (key, item) {
      this.selected[key] = item
      this.tabIndex++
      this.checkShortname()
    },

    /**
     * List the available templates or volumes.
     * @param {String} key
     *   The item key.
     */
    availableCollectionItems (key) {
      const collection = this.selected['collection']
      return isEmpty(collection) || !collection.info[key]
        ? []
        : Object.values(this.selected['collection'].info[key])
    },

    /**
     * Create a project.
     */
    createProject () {
      this.notifyInfo({ message: 'Generating project, please wait...' })
      this.processing = true
      const endpoint = '/libcrowds/projects/create'
      return this.$axios.$post(endpoint, this.selected).then(data => {
        this.processing = false
        const link = this.$router.resolve({
          name: 'admin-project-short_name-thumbnail',
          params: {
            short_name: data.short_name
          }
        })
        let text = data.flash
        if (data.status === 'success') {
          text += `<br><br><a href="${link}">Click here to add a thumbnail</a>`
        }
        this.$swal({
          title: capitalize(data.status),
          html: text,
          type: data.status
        })
      }).catch(err => {
        this.$nuxt.error(err)
      })
    },

    /**
     * Check a project with this template and volume hasn't been created.
     */
    checkShortname () {
      const endpoint = '/libcrowds/projects/check-shortname'
      this.shortnameValid = false
      this.existingProjectDetails = {}
      if (this.selectionsComplete) {
        this.$axios.$post(endpoint, this.selected).then(data => {
          if (data.status !== 'error') {
            this.shortnameValid = true
          } else {
            this.existingProjectDetails = {
              name: data.name,
              short_name: data.short_name
            }
          }
        })
      }
    }
  },

  beforeMount () {
    this.$store.dispatch('UPDATE_CURRENT_PROJECT', {})
  }
}
</script>
