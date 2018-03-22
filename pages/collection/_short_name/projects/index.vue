<template>
  <div id="collection-projects">
    <h1 class="text-center">{{ title }}</h1>
    <span v-if="pageContent">
      <span v-html="pageContent"></span>
      <hr class="mx-0">
    </span>

    <b-row
      id="get-started"
      class="collection-nav-item"
      data-title="Get Started">

      <b-col xl="3" class="d-none d-xl-block">
        <b-card
          header="Sorting Options"
          class="options-card mb-2"
          :bg-variant="darkMode ? 'dark' : null"
          :text-variant="darkMode ? 'white' : null">
          <filter-projects-data
            v-model="tagModel"
            :collection="collection"
            @input="reset"
            @select="onFilter">
          </filter-projects-data>
          <sort-projects-data
            v-model="sortModel"
            class="mb-2"
            @input="reset"
            @select="onSort">
          </sort-projects-data>
          <toggle-completed-data
            class="mb-2"
            v-model="showCompleted">
          </toggle-completed-data>
          <b-btn
            block
            size="sm"
            variant="primary"
            @click="clearFilters">
            Clear filters
          </b-btn>
        </b-card>

        <social-media-buttons
          :shareUrl="shareUrl"
          :tweet="tweet"
          size="sm"
          class="text-center">
        </social-media-buttons>
      </b-col>

      <b-col xl="9">
        <card-base
          title="Projects"
          description="Choose a project"
          class="d-xl-none">

          <b-form slot="controls" :class="darkMode ? 'form-dark' : null">
            <b-form-input
              v-model="filter"
              class="search-control"
              size="sm"
              :placeholder="`Type to search by ${filterBy}`">
            </b-form-input>
          </b-form>

          <projects-table
            v-if="showProjectsTable"
            :filter="filter"
            :filter-by="filterBy"
            :collection="collection">
            <template slot="action" slot-scope="project">
              <project-contrib-button
                :collection="collection"
                :project="project.item">
              </project-contrib-button>
            </template>
          </projects-table>
        </card-base>

        <transition-group
          tag="ul"
          class="list-unstyled d-none d-xl-block"
          name="fade-up">
          <li v-for="project in filteredProjects" :key="project.id">
            <project-card
              :collection="collection"
              :project="project"
              @tagclick="updateTagModel">
            </project-card>
          </li>
        </transition-group>

        <infinite-load-projects
          ref="infiniteload"
          :collection="collection"
          :orderby="sortModel.orderby"
          :desc="sortModel.desc"
          no-results=""
          no-more-results=""
          v-model="projects">
        </infinite-load-projects>

        <p class="lead text-center" v-if="allProjectsFiltered">
          No projects are currently available using the selected filters.
          <br>
          You can use the input fields on the left to change them.
        </p>

      </b-col>
    </b-row>
  </div>
</template>

<script>
import marked from 'marked'
import { collectionMetaTags } from '@/mixins/metaTags'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { computeShareUrl } from '@/mixins/computeShareUrl'
import { filterProjects } from '@/mixins/filterProjects'
import SocialMediaButtons from '@/components/buttons/SocialMedia'
import SortProjectsData from '@/components/data/SortProjects'
import ToggleCompletedData from '@/components/data/ToggleCompleted'
import FilterProjectsData from '@/components/data/FilterProjects'
import ProjectCard from '@/components/cards/Project'
import InfiniteLoadProjects from '@/components/InfiniteLoadProjects'
import InfiniteLoadingTable from '@/components/tables/InfiniteLoading'
import ProjectContribButton from '@/components/buttons/ProjectContrib'
import ProjectsTable from '@/components/tables/Projects'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'collection-tabs',

  mixins: [
    fetchCollectionByName,
    computeShareUrl,
    filterProjects,
    collectionMetaTags
  ],

  data () {
    return {
      title: 'Take Part',
      projects: [],
      showCompleted: false,
      filter: null,
      filterBy: 'name',
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
      },
      sortModel: {
        orderby: 'overall_progress',
        desc: true
      },
      showProjectsTable: false
    }
  },

  components: {
    SortProjectsData,
    FilterProjectsData,
    ToggleCompletedData,
    ProjectCard,
    InfiniteLoadProjects,
    SocialMediaButtons,
    InfiniteLoadingTable,
    ProjectContribButton,
    ProjectsTable,
    CardBase
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },

    collection () {
      return this.$store.state.currentCollection
    },

    pageContent () {
      return marked(this.collection.info.content.projects)
    },

    allProjectsFiltered () {
      return this.projects.length > 0 && this.filteredProjects.length === 0
    },

    description () {
      return `Choose a ${this.collection.name} project to take part in.`
    },

    tweet () {
      return `Choose and play ${this.collection.name} and help enable future` +
        `research.`
    }
  },

  methods: {
    /**
     * Track filters.
     * @param {Object} name
     *   The tag name.
     * @param {Object} type
     *   The tag type.
     */
    onFilter (name, type) {
      const nameStr = name.toLowerCase().replace(' ', '_')
      const typeStr = type.toLowerCase().replace(' ', '_')
      if (this.$ga) {
        this.$ga.event({
          eventCategory: 'Filters',
          eventAction: `${typeStr}:${nameStr}`,
          eventLabel: this.collection.name,
          eventValue: 1
        })
      }
    },

    /**
     * Track sorting.
     * @param {String} value
     *   The sorting value.
     */
    onSort (value) {
      if (this.$ga) {
        this.$ga.event({
          eventCategory: 'Sorts',
          eventAction: `${value.orderby}_${value.desc ? 'desc' : 'asc'}`,
          eventLabel: this.collection.name,
          eventValue: 1
        })
      }
    },

    /**
     * Reset the infinite loading table.
     *
     * Change the number param if the transition time changes.
     */
    reset () {
      this.$refs.infiniteload.reset(500)
    },

    /**
     * Remove the table on large screens.
     */
    setTableVisiblity () {
      this.showProjectsTable = window.innerWidth < 1200
    }
  },

  mounted () {
    const nodes = document.querySelectorAll('.collection-nav-item')
    this.$store.dispatch('UPDATE_COLLECTION_NAV_ITEMS', nodes)

    // The table won't load while hidden so listen for window size
    window.addEventListener('resize', this.setTableVisiblity)
    this.setTableVisiblity()
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.setTableVisiblity)
  }
}
</script>
