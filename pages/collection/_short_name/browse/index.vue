<template>
  <section id="collection-browse">
    <h1 class="text-center">{{ title }}</h1>
    <span v-if="pageContent">
      <span v-html="pageContent"></span>
      <hr class="mx-0">
    </span>

    <div v-if="hasTagAnnotations">
      <no-ssr>
        <div
          v-masonry transition-duration="1s"
          item-selector=".image-grid-item"
          class="image-grid">
          <div
            v-for="(url, index) in uniqueImageURLs"
            :key="index"
            v-masonry-tile
            class="image-grid-item"
            column-width="#image-grid-column"
            gutter="#image-grid-gutter"
            @click="showImagePreview">
            <img :src="url" class="img-fluid">
          </div>
        </div>
      </no-ssr>
      <div id="image-grid-column"></div>
      <div id="image-grid-gutter"></div>

      <infinite-load-annotations
        v-model="tagAnnotations"
        :container-iri="currentCollection.info.annotations.tags">
      </infinite-load-annotations>
    </div>

    <p class="lead text-center" v-else>
      Sorry, user tags haven't been configured for this collection yet.
    </p>
  </section>
</template>

<script>
import marked from 'marked'
import { collectionMetaTags } from '@/mixins/metaTags'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import InfiniteLoadAnnotations from '@/components/InfiniteLoadAnnotations'

export default {
  layout: 'collection-tabs',

  mixins: [ fetchCollectionByName, collectionMetaTags ],

  data () {
    return {
      title: 'Browse',
      tagAnnotations: []
    }
  },

  components: {
    InfiniteLoadAnnotations
  },

  computed: {
    currentCollection () {
      return this.$store.state.currentCollection
    },

    pageContent () {
      return marked(this.currentCollection.info.content.browse)
    },

    description () {
      return `Browse ${this.currentCollection.info.brand} albums.`
    },

    hasTagAnnotations () {
      return this.currentCollection.info.annotations.hasOwnProperty('tags')
    },

    uniqueImageURLs () {
      const urls = this.tagAnnotations.map(anno => {
        if (typeof anno.target === 'object') {
          // Return smaller thumbnails for IIIF images
          return anno.target.source.replace(/(max)(?!.*\1)/, '240,')
        }
        return anno.target
      })
      return Array.from(new Set(urls))
    }
  },

  methods: {
    /**
     * Expand image to show preview with details.
     */
    showImagePreview () {
      console.log('show preview')
    }
  }
}
</script>

<style lang="scss">
.image-grid {
  #image-grid-gutter {
    width: 12px;
  }

  #image-grid-column {
    max-width: 200px;
  }
}
</style>
