<template>
  <div id="collection-projects">
    <h1 class="text-center">Get Started</h1>
    <span v-if="pageContent">
      <span v-html="pageContent"></span>
      <hr class="mx-0">
    </span>

    <b-row
      id="get-started"
      class="collection-nav-item"
      data-title="Get Started">
      <b-col xl="3" class="mb-xl-3 d-none d-xl-block">

        <b-card header="Sorting Options" class="options-card mb-2">
          <filter-projects-data
            v-model="tagModel"
            :collection="collection">
          </filter-projects-data>
          <sort-projects-data
            v-model="sortModel"
            class="mb-3">
          </sort-projects-data>
          <toggle-completed-data
            v-model="showCompleted">
          </toggle-completed-data>
        </b-card>

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
          :sortBy.sync="sortModel.orderby"
          :sortDesc.sync="sortModel.desc"
          class="d-lg-none">
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
import { filterProjects } from '@/mixins/filterProjects'
import SocialMediaButtons from '@/components/buttons/SocialMedia'
import SortProjectsData from '@/components/data/SortProjects'
import ToggleCompletedData from '@/components/data/ToggleCompleted'
import FilterProjectsData from '@/components/data/FilterProjects'
import ProjectCard from '@/components/cards/Project'
import InfiniteLoadProjects from '@/components/InfiniteLoadProjects'
import InfiniteLoadingTable from '@/components/tables/InfiniteLoading'
import ProjectContribButton from '@/components/buttons/ProjectContrib'

export default {
  layout: 'collection-tabs',

  mixins: [
    fetchCollectionByName,
    computeShareUrl,
    filterProjects
  ],

  data () {
    return {
      projects: [],
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
      },
      sortModel: {
        orderby: 'overall_progress',
        desc: true
      }
    }
  },

  head () {
    return {
      title: 'Get Started',
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
      return marked(this.collection.info.content.projects)
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
    ProjectContribButton
  },

  mounted () {
    const nodes = document.querySelectorAll('.collection-nav-item')
    this.$store.dispatch('UPDATE_COLLECTION_NAV_ITEMS', nodes)
  }
}
</script>
