<template>
  <div id="collection-about">
    <h1 class="text-center">About {{ collection.name }}</h1>
    <span v-if="pageContent">
      <span v-html="pageContent"></span>
      <hr class="mx-0">
    </span>

    <div class="text-center">
      <b-btn
        variant="success"
        size="lg"
        :to="{
          name: 'collection-short_name-projects',
          params: {
            short_name: collection.short_name
          }
        }">
        Get Started
      </b-btn>
    </div>
  </div>
</template>

<script>
import marked from 'marked'
import { collectionMetaTags } from '@/mixins/metaTags'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import localConfig from '@/local.config'

export default {
  layout: 'collection-tabs',

  mixins: [ fetchCollectionByName, collectionMetaTags ],

  data () {
    return {
      title: 'About',
      localConfig: localConfig
    }
  },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    },

    pageContent () {
      return marked(this.collection.info.content.about)
    },

    description () {
      return `Learn more about ${this.collection.info.brand}.`
    }
  },

  methods: {
    /**
     * Markdown processor.
     */
    marked
  },

  mounted () {
    const nodes = document.querySelectorAll('h2')
    this.$store.dispatch('UPDATE_COLLECTION_NAV_ITEMS', nodes)
  }
}
</script>

<style lang="scss">
#collection-about {
  img {
    display: block;
    margin: 2rem auto;
    max-height: 400px;
    max-width: 100%;
  }
}
</style>
