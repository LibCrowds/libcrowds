<template>
  <div id="collection-contribute">
    <h1 class="text-center">Contribute</h1>
    <span v-if="pageContent">
      <span v-html="pageContent"></span>
      <hr class="mx-0">
    </span>

    <b-row
      id="get-started"
      class="collection-nav-item"
      data-title="Get Started">
      <b-col xl="3" class="mb-xl-3 d-none d-xl-block">

        <project-filters-card
          class="mb-3"
          :projects="projects"
          :collection="collection"
          @change="onFiltersChange">
        </project-filters-card>

        <project-sorting-card
          class="mb-3"
          @change="onSortChange">
        </project-sorting-card>

        <social-media-buttons
          :shareUrl="shareUrl"
          size="sm"
          class="text-center">
        </social-media-buttons>
      </b-col>

      <b-col xl="9">
        <b-table
          hover
          striped
          show-empty
          :items="filteredProjects"
          :fields="tableFields"
          class="d-lg-none"
          @sort-changed="onSortChange">
          <template slot="overall_progress" scope="project">
            {{ project.item.overall_progress }}%
          </template>
          <template slot="actions" scope="project">
            <project-contrib-button
              block
              :collection="collection"
              :project="project.item">
            </project-contrib-button>
          </template>
        </b-table>

        <transition-group
          tag="ul"
          class="list-unstyled d-none d-lg-block"
          name="fade-up">
          <li v-for="project in filteredProjects" :key="project.id">
            <project-card
              :collection="collection"
              :project="project">
            </project-card>
          </li>
        </transition-group>

        <infinite-load-projects
          ref="infiniteload"
          :short-name="collection.short_name"
          :orderby="orderby"
          :desc="desc || false"
          :no-results="noResults"
          v-model="projects">
        </infinite-load-projects>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import marked from 'marked'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { computeShareUrl } from '@/mixins/computeShareUrl'
import SocialMediaButtons from '@/components/buttons/SocialMedia'
import ProjectSortingCard from '@/components/cards/ProjectSorting'
import ProjectFiltersCard from '@/components/cards/ProjectFilters'
import ProjectCard from '@/components/cards/Project'
import InfiniteLoadProjects from '@/components/InfiniteLoadProjects'
import InfiniteLoadingTable from '@/components/tables/InfiniteLoading'
import ProjectContribButton from '@/components/buttons/ProjectContrib'

export default {
  layout: 'collection-tabs',

  mixins: [ fetchCollectionByName, computeShareUrl ],

  data () {
    return {
      projects: [],
      filteredProjects: [],
      orderby: 'overall_progress',
      desc: false,
      noResults: 'No projects are available using the selected filters, ' +
        'use the input fields on the left to change them.',
      tableFields: {
        name: {
          label: 'Name'
        },
        n_tasks: {
          label: 'Tasks',
          class: 'text-center d-none d-lg-table-cell',
          sortable: true
        },
        overall_progress: {
          label: 'Progress',
          class: 'text-center d-none d-md-table-cell',
          sortable: true
        },
        actions: {
          label: 'Action',
          class: 'text-center'
        }
      }
    }
  },

  head () {
    return {
      title: 'Contribute',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Choose a ${this.collection.name} project to contribute
            towards`
        }
      ]
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },

    collection () {
      return this.$store.state.currentCollection
    },

    pageContent () {
      return marked(this.collection.info.content.contribute)
    },

    searchParams () {
      const params = {
        collection_short_name: this.collection.short_name
      }
      if (!this.currentUser.admin) {
        params.published = true
      }
      return params
    }
  },

  components: {
    ProjectSortingCard,
    ProjectFiltersCard,
    ProjectCard,
    InfiniteLoadProjects,
    SocialMediaButtons,
    InfiniteLoadingTable,
    ProjectContribButton
  },

  methods: {
    /**
     * Handle filters change.
     * @param {Object} projects
     *   The filtered projects.
     */
    onFiltersChange (projects) {
      console.log(projects)
      this.filteredProjects = projects
    },

    /**
     * Handle sort change.
     * @param {Object} value
     *   The sorting params.
     */
    onSortChange (value) {
      this.orderby = value.sortBy
      this.desc = value.sortDesc
    }
  },

  mounted () {
    const nodes = document.querySelectorAll('.collection-nav-item')
    this.$store.dispatch('UPDATE_COLLECTION_NAV_ITEMS', nodes)
  }
}
</script>

<style lang="scss">
#collection-contribute {
  .project-card {
    transition: all 500ms ease;
  }
}
</style>
