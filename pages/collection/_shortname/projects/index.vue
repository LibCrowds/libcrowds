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
          :collection="collection">
        </project-sorting-card>

      </b-col>
      <b-col xl="9">

        <project-cards-list
          :search-params="searchParams">
        </project-cards-list>

      </b-col>
    </b-row>
  </div>
</template>

<script>
import marked from 'marked'
import { loadAsyncCollection } from '@/mixins/loadAsyncCollection'
import ProjectSortingCard from '@/components/cards/ProjectSorting'
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
    ProjectSortingCard,
    ProjectCardsList
  }
}
</script>
