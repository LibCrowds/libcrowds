<template>
  <div id="collection-browse">
    <h1 class="text-center">{{ title }}</h1>
    <span v-if="pageContent">
      <span v-html="pageContent"></span>
      <hr class="mx-0">
    </span>

    <b-card-group
      deck
      v-for="(batch, index) in batchedTags"
      :key="index">
      <album-card
        v-for="tag in batch"
        v-if="tag"
        :key="tag.id"
        :collection="currentCollection"
        :tileSources="tag.target"
        :title="tag.body.value"
        :description="`${tag.target.length} items`">
      </album-card>
    </b-card-group>
  </div>
</template>

<script>
import marked from 'marked'
import { batch } from '@/utils/batch'
import { collectionMetaTags } from '@/mixins/metaTags'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import AlbumCard from '@/components/Cards/Album'

export default {
  layout: 'collection-tabs',

  mixins: [ fetchCollectionByName, collectionMetaTags ],

  data () {
    return {
      title: 'Browse'
    }
  },

  asyncData ({ app, params, error }) {
    const endpoint = `/lc/categories/${params.short_name}/tags`
    return app.$axios.$get(endpoint).then(data => {
      return {
        tags: data.tags
      }
    }).catch(err => {
      error(err)
    })
  },

  components: {
    AlbumCard
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

    batchedTags () {
      return batch(this.tags, 2, null)
    }
  },

  methods: {
    /**
     * Markdown processor.
     */
    marked
  },

  mounted () {
    const nodes = document.querySelectorAll('.collection-nav-item')
    this.$store.dispatch('UPDATE_COLLECTION_NAV_ITEMS', nodes)
  }
}
</script>
