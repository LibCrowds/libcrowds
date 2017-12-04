<template>
  <card-base :title="title" :description="description">
    <b-btn
      slot="controls"
      variant="success"
      class="float-right ml-1"
      size="sm">
      Update Templates
    </b-btn>
    <b-btn
      slot="controls"
      variant="success"
      class="float-right"
      size="sm">
      Update Volumes
    </b-btn>

    <b-tabs small card v-model="tabIndex">
      <b-tab title="Introduction">
        <b-card-body>
          <p class="lead">
            How to create a project
          </p>
          <p>
            The following pages contain a series of options for generating a
            new project from a template.
          </p>
          <p>
            The templates are maintained by {{ localConfig.brand }}
            administrators. This is partly for quality control and partly so
            that it's easier for future projects to be generated and organised.
            If you can't find a suitable template click the
            <strong>Update Templates</strong> to request a new template, or an
            update to an existing one.
          </p>
          <p>
            Similarly, you will be asked to choose the volume that contains
            the input for the project (e.g. the images). The volumes for each
            collection are also maintained by {{ localConfig.brand }}
            administrators for the reasons outlined above. If you want to add
            a new volume, or set of volumes, please click the
            <strong>Update Volumes</strong> button.
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
          :fields="collectionTableFields"
          domain-object="category">
          <template slot="action" scope="collection">
            <b-btn
              variant="success"
              size="sm"
              @click="selectCollection(collection.item)"
              :disabled="selectedCollection.id == collection.item.id">
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
            that you want to create, click the
            <strong>Update Templates</strong> button at the top of this
            page.
          </p>
        </b-card-body>
        <b-table
          v-if="selectedCollection.id"
          responsive
          striped
          hover
          show-empty
          class="border-left-0 border-right-0 border-bottom-0"
          :items="selectedCollection.info.templates"
          :fields="templateTableFields">
          <template slot="action" scope="template">
            <b-btn
              variant="success"
              size="sm"
              :disabled="selectedTemplates.name == template.item.name"
              @click="selectTemplate(template.item)">
              Select
            </b-btn>
          </template>
        </b-table>
        <b-card-body class="pt-0" v-else>
          <b-alert
            show
            variant="primary">
              To see the available templates start by choosing a collection.
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
            listed click the <strong>Update Volumes</strong> button at the top
            of this page.
          </p>
        </b-card-body>
        <b-table
          v-if="selectedCollection.id"
          responsive
          striped
          hover
          show-empty
          class="border-left-0 border-right-0 border-bottom-0"
          :items="selectedCollection.info.volumes"
          :fields="volumeTableFields">
          <template slot="action" scope="volume">
            <b-btn
              variant="success"
              size="sm"
              :disabled="selectedVolume.name == volume.item.name"
              @click="selectVolume(volume.item)">
              Select
            </b-btn>
          </template>
        </b-table>
        <b-card-body class="pt-0" v-else>
          <b-alert
            show
            variant="primary">
              To see the available volumes start by choosing a collection.
          </b-alert>
        </b-card-body>
      </b-tab>

      <b-tab title="Confirm">
        Sibzamini!
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
          :disabled="tabIndex >= 3"
          class="mr-1"
          @click="tabIndex++">
          Next
        </b-btn>
        <b-btn
          variant="success"
          :disabled="tabIndex !== 3">
          Create
        </b-btn>
      </span>
    </b-card-footer>

  </card-base>
</template>

<script>
import localConfig from '@/local.config.js'
import { notifications } from '@/mixins/notifications'
import { metaTags } from '@/mixins/metaTags'
import PybossaForm from '@/components/forms/PybossaForm'
import CardBase from '@/components/cards/Base'
import InfiniteLoadingTable from '@/components/tables/InfiniteLoading'

export default {
  layout: 'admin-project-dashboard',

  mixins: [ notifications, metaTags ],

  data () {
    return {
      title: 'New Project',
      description: 'Create a new project',
      tabIndex: 0,
      localConfig: localConfig,
      selectedCollection: {},
      selectedVolume: {},
      collectionTableFields: {
        name: {
          label: 'Name'
        },
        created: {
          label: 'Created',
          class: 'text-center d-none d-md-table-cell',
          sortable: true
        }
      },
      volumeTableFields: {
        name: {
          label: 'Name',
          sortable: true
        },
        action: {
          label: 'Action',
          sortable: true
        }
      }
    }
  },

  components: {
    PybossaForm,
    CardBase,
    InfiniteLoadingTable
  },

  methods: {
    /**
     * Handle success.
     * @param {Object} data
     *   The response data.
     */
    onSuccess (data) {
      const category = data.categories.filter(category => {
        return category.name === data.form.name
      })[0]
      this.$router.push({
        name: 'admin-collection-short_name-settings',
        params: {
          short_name: category.short_name
        }
      })
    },

    /**
     * Handle selection of a collection.
     * @param {Object} collection
     *   The collection.
     */
    selectCollection (collection) {
      this.selectedCollection = collection
      this.tabIndex++
      console.log(this.tabIndex)
    },

    /**
     * Handle selection of a volume.
     * @param {Object} volume
     *   The volume.
     */
    selectVolume (volume) {
      this.selectedColume = volume
      this.tabIndex++
      console.log(this.tabIndex)
    }
  },

  beforeMount () {
    this.$store.dispatch('UPDATE_CURRENT_PROJECT', {})
  }
}
</script>
