<template>
  <div id="collection-contribute">
    <h1 class="text-center">Contribute</h1>
    <span v-if="pageContent">
      <span v-html="pageContent"></span>
      <hr class="mx-0">
    </span>

    <project-cards-list
      :search-params="searchParams">
    </project-cards-list>

  </div>
</template>

<script>
import marked from 'marked'
import { loadAsyncCollection } from '@/mixins/loadAsyncCollection'
import ProjectSortingToolbar from '@/components/toolbars/ProjectSorting'
import ProjectCardsList from '@/components/lists/ProjectCards'

export default {
  layout: 'collection-tabs',

  mixins: [ loadAsyncCollection ],

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
    pageContent () {
      return marked(this.$store.state.collection.info.content.contribute)
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
    ProjectSortingToolbar,
    ProjectCardsList
  }
}
</script>
