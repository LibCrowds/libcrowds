<template>
  <div id="collection-contribute">
    <h1 class="text-center">Contribute</h1>
    <span v-if="pageContent">
      <span v-html="pageContent"></span>
      <hr class="mx-0">
    </span>

    <projects-table
      :search-params="searchParams"
      success-btn="Contribute"
      @successclick="contribute">
    </projects-table>

    <social-media-buttons
      :shareUrl="shareUrl"
      size="sm"
      class="mt-3 d-none d-xl-block text-center">
    </social-media-buttons>

  </div>
</template>

<script>
import marked from 'marked'
import { loadAsyncCollection } from '@/mixins/loadAsyncCollection'
import ProjectSortingOptions from '@/components/project/SortingOptions'
import ProjectCardsList from '@/components/lists/ProjectCards'
import ProjectContribButton from '@/components/buttons/ProjectContrib'
import SocialMediaButtons from '@/components/buttons/SocialMedia'
import ProjectsTable from '@/components/tables/Projects'

export default {
  layout: 'collection-tabs',

  mixins: [ loadAsyncCollection ],

  data () {
    return {
      viewOpts: [
        { text: 'List', value: 'list' },
        { text: 'Table', value: 'table' }
      ],
      activeView: 'list',
      showCompleted: false
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
    shareUrl () {
      return process.browser ? window.location.href : ''
    },
    currentUser () {
      return this.$store.state.currentUser
    },
    pageContent () {
      return marked(this.collection.info.content.contribute)
    },
    searchParams () {
      const params = {
        category_id: this.collection.id
      }
      if (!this.currentUser.admin) {
        params.published = true
      }
      return params
    }
  },

  components: {
    ProjectSortingOptions,
    ProjectCardsList,
    ProjectContribButton,
    SocialMediaButtons,
    ProjectsTable
  },

  methods: {
    /**
     * Handle view change.
     * @param {String} view
     *   The view.
     */
    onViewChange (view) {
      this.activeView = view
    },

    /**
     * Handle completed toggle.
     */
    onToggleCompleted () {
      this.showCompleted = !this.showCompleted
    },

    /**
     *
     */
    contribute (project) {
      this.$router.push({
        name: 'collection-shortname-projects-id',
        params: {
          shortname: this.collection.short_name,
          id: project.id
        }
      })
    }
  }
}
</script>
