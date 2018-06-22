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

      <b-col id="sorting-options" xl="3" class="d-none d-xl-block">
        <b-card
          header="Sorting Options"
          class="options-card mb-2"
          :bg-variant="darkMode ? 'dark' : null"
          :text-variant="darkMode ? 'white' : null">
          <filter-projects-data
            v-model="filterModel"
            :collection="collection"
            @select="onFilter">
          </filter-projects-data>
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
        <transition-group
          tag="ul"
          class="list-unstyled"
          name="fade-up">
          <li v-for="project in filteredProjects" :key="project.id">
            <project-card
              :collection="collection"
              :project="project"
              @filter="updateFilterModel">
            </project-card>
          </li>
        </transition-group>

        <infinite-load-domain-objects
          ref="infiniteload"
          domain-object="project"
          v-model="projects"
          :search-params="params"
          :show-no-results="false"
          @complete="projectLoadingComplete = true">
        </infinite-load-domain-objects>

        <p
          class="lead text-center"
          v-if="allProjectsFiltered && projectLoadingComplete">
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
import asyncFilter from 'async/filter'
import isEmpty from 'lodash/isEmpty'
import { collectionMetaTags } from '@/mixins/metaTags'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { computeShareUrl } from '@/mixins/computeShareUrl'
import SocialMediaButtons from '@/components/buttons/SocialMedia'
import FilterProjectsData from '@/components/data/FilterProjects'
import ProjectCard from '@/components/cards/Project'
import InfiniteLoadDomainObjects from '@/components/infiniteload/DomainObjects'
import ProjectContribButton from '@/components/buttons/ProjectContrib'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'collection-tabs',

  mixins: [
    fetchCollectionByName,
    computeShareUrl,
    collectionMetaTags
  ],

  data () {
    return {
      title: 'Take Part',
      projects: [],
      searchString: null,
      searchKeys: ['name'],
      filterModel: {},
      projectLoadingComplete: false,
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

  components: {
    FilterProjectsData,
    ProjectCard,
    SocialMediaButtons,
    InfiniteLoadDomainObjects,
    ProjectContribButton,
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
    },

    filteredProjects () {
      let filtered = this.projects.filter(project => {
        return Number(project.stats.overall_progress) < 100
      }).filter(project => {
        for (let key of Object.keys(this.filterModel)) {
          project.info.filters = project.info.filters || {}
          if (project.info.filters[key] !== this.filterModel[key]) {
            return false
          }
        }
        return true
      })

      // Check each project to see if we can get a task for the current user.
      // Not the most efficient as we have to make an additional call for
      // each project. There could also be a problem with rate limiting if
      // the user has finished hundreds of projects that are not yet complete,
      // but hopefully that is unlikely! We might see if we can update the
      // PYBOSSA API at some point to filter these out in the same request.
      asyncFilter(filtered, (p, callback) => {
        this.$axios.$get(`/api/project/${p.id}/newtask`).then(data => {
          callback(null, (
            !isEmpty(data) &&
            !data.info.hasOwnProperty('error')
          ))
        }).catch(err => {
          this.$nuxt.error(err)
        })
      })

      return filtered
    },

    params () {
      return {
        category_id: this.collection.id,
        stats: 1,
        all: 1,
        orderby: 'created',
        desc: 1
      }
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
     * Set a filter.
     * @param {String} type
     *   The type.
     * @param {String} value
     *   The value.
     */
    updateFilterModel (type, value) {
      this.filterModel[type] = value
      // Create a new object to trigger changes
      this.filterModel = Object.assign({}, this.filterModel)
    },

    clearFilters () {
      this.filterModel = Object.assign({})
    }
  },

  mounted () {
    const nodes = document.querySelectorAll('.collection-nav-item')
    this.$store.dispatch('UPDATE_COLLECTION_NAV_ITEMS', nodes)
  }
}
</script>

<style lang="scss">
#sorting-options {
  .multiselect--active {
    z-index: 4; // Show over the toggle button
  }
}
</style>