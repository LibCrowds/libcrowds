<template>
  <div id="collection-browse">
    <h1 class="text-center">{{ title }}</h1>
    <span v-if="pageContent">
      <span v-html="pageContent"></span>
      <hr class="mx-0">
    </span>

    <div v-if="hasAnnotations">
      <b-card-group
        deck
        v-for="(batch, index) in tagAlbums"
        :key="index">
        <album-card
          v-for="tagAlbum in batch"
          v-if="tagAlbum"
          :key="tagAlbum.id"
          :thumbnail="tagAlbum.thumbnail"
          :title="tagAlbum.title"
          :description="`${tagAlbum.count} items`">
        </album-card>
      </b-card-group>

      <infinite-load-annotations
        v-model="annotations"
        :container-iri="currentCollection.info.annotations.tags">
      </infinite-load-annotations>
    </div>

    <p class="lead text-center" v-else>
      Sorry, user tags haven't been configured for this collection yet.
    </p>
  </div>
</template>

<script>
import marked from 'marked'
import { batch } from '@/utils/batch'
import { collectionMetaTags } from '@/mixins/metaTags'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import AlbumCard from '@/components/Cards/Album'
import InfiniteLoadAnnotations from '@/components/InfiniteLoadAnnotations'

export default {
  layout: 'collection-tabs',

  mixins: [ fetchCollectionByName, collectionMetaTags ],

  data () {
    return {
      title: 'Browse',
      annotations: []
    }
  },

  components: {
    AlbumCard,
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

    tagAlbums () {
      const tagAlbums = this.annotations.map(anno => {
        return {
          id: anno.id,
          title: anno.body.value,
          count: anno.target.length,
          thumbnail: this.getTagThumbnail(anno.target[0])
        }
      })
      return batch(tagAlbums, 3, null)
    },

    hasAnnotations () {
      return this.currentCollection.info.annotations.hasOwnProperty('tags')
    }
  },

  methods: {
    /**
     * Get a tag thumbnail based on target.
     * @param {Object} target
     *   The target.
     */
    getTagThumbnail (target) {
      const url = typeof target.source === 'object'
        ? target.source.id
        : target.source

      // Return smaller thumbnail for IIIF images
      if (target.hasOwnProperty('scope')) {
        return url.replace(/(max)(?!.*\1)/, '240,')
      }
      return url
    },

    /**
     * Markdown processor.
     */
    marked
  }
}
</script>
