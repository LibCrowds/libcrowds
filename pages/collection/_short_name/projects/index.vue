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
        <project-sorting-card
          class="mb-3"
          :collection="collection"
          v-model="searchParams">
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
          :items="incompleteProjects"
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
          <li v-for="project in incompleteProjects" :key="project.id">
            <project-card
              :collection="collection"
              :project="project">
            </project-card>
          </li>
        </transition-group>

        <infinite-load
          ref="infiniteload"
          domain-object="project"
          :search-params="mergedSearchParams"
          :no-results="noResults"
          v-model="projects">
        </infinite-load>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import merge from 'lodash/merge'
import marked from 'marked'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { computeShareUrl } from '@/mixins/computeShareUrl'
import SocialMediaButtons from '@/components/buttons/SocialMedia'
import ProjectSortingCard from '@/components/cards/ProjectSorting'
import ProjectCard from '@/components/cards/Project'
import InfiniteLoad from '@/components/InfiniteLoad'
import InfiniteLoadingTable from '@/components/tables/InfiniteLoading'
import ProjectContribButton from '@/components/buttons/ProjectContrib'

export default {
  layout: 'collection-tabs',

  mixins: [ fetchCollectionByName, computeShareUrl ],

  data () {
    return {
      projects: [],
      searchParams: {},
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

    mergedSearchParams () {
      const params = {
        category_id: this.collection.id
      }
      if (!this.currentUser.admin) {
        params.published = true
      }
      return merge(params, this.searchParams)
    },

    incompleteProjects () {
      return this.projects.filter(project => {
        return project.overall_progress < 100
      })
    }
  },

  components: {
    ProjectSortingCard,
    ProjectCard,
    InfiniteLoad,
    SocialMediaButtons,
    InfiniteLoadingTable,
    ProjectContribButton
  },

  methods: {
    /**
     * Handle sort change.
     */
    onSortChange (value) {
      this.searchParams.orderby = value.sortBy
      this.searchParams.desc = value.sortDesc
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
