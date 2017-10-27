<template>
  <div id="collection-contribute">
    <h1 class="text-center">Contribute</h1>
    <span v-if="pageContent">
      <span v-html="pageContent"></span>
      <hr class="mx-0">
    </span>

    <b-row>
      <b-col xl="3" class="mb-3">
        <project-sorting-card
          class="mb-3 d-none d-xl-block"
          :collection="collection"
          v-model="searchParams">
        </project-sorting-card>
      </b-col>

      <b-col xl="9">
        <transition-group
          tag="ul"
          class="list-unstyled">
          <li v-for="project in projects" :key="project.id">
            <project-card
              :collection="collection"
              :project="project">
            </project-card>
          </li>
        </transition-group>

        <infinite-load
          ref="infiniteload"
          :search-params="mergedParams"
          domain-object="project"
          v-model="projects">
          <span slot="no-results"></span>
          <span slot="no-more"></span>
        </infinite-load>

      </b-col>
    </b-row>
  </div>
</template>

<script>
import marked from 'marked'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import ProjectSortingCard from '@/components/cards/ProjectSorting'
import ProjectCard from '@/components/cards/Project'
import InfiniteLoad from '@/components/InfiniteLoad'

export default {
  layout: 'collection-tabs',

  mixins: [ fetchCollectionByName ],

  data () {
    return {
      projects: [],
      searchParams: {
        complete: false
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

    mergedParams () {
      this.searchParams.category_id = this.collection.id
      if (!this.currentUser.admin) {
        this.searchParams.published = true
      }
      return this.searchParams
    }
  },

  components: {
    ProjectSortingCard,
    ProjectCard,
    InfiniteLoad
  }
}
</script>

<style lang="scss">
#collection-contribute {
  .project-card {
    transition: all 500ms ease;
  }

  .v-enter,
  .v-leave-to {
    -webkit-transform: translateY(20px);
    transform: translateY(20px);
    opacity: 0;
  }
}
</style>
