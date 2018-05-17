<template>
  <section id="collection-browse">
    <h1 class="text-center">{{ title }}</h1>
    <span v-if="pageContent">
      <span v-html="pageContent"></span>
      <hr class="mx-0">
    </span>

    <div v-if="hasTagAnnotations">
      <search-tags
        :container-iri="currentCollection.info.annotations.tags"
        :value="selectedTags"
        class="mb-2"
        @input="$refs.grid.filter('filterByTag')">
      </search-tags>

      <no-ssr>
        <isotope
          ref="grid"
          v-images-loaded:on.progress="layout"
          :options="imageGridOptions"
          :list="uniqueImageData">
          <div
            v-for="(item, index) in uniqueImageData"
            :key="index"
            class="img-grid-item"
            v-b-modal['previewModalId']>
            <img :src="item.url" class="img-fluid">
          </div>
        </isotope>
      </no-ssr>

      <infinite-load-annotations
        v-model="tagAnnotations"
        :container-iri="currentCollection.info.annotations.tags"
        no-results="It looks like nothing has been tagged yet!"
        no-more-results="">
      </infinite-load-annotations>
    </div>

    <p class="lead text-center" v-else>
      Sorry, user tags haven't been configured for this collection yet.
    </p>

    <b-modal
      lazy
      :id="previewModalId"
      title="Item Preview"
      size="lg"
      hide-footer
      hide-header
      :header-text-variant="darkMode ? 'white' : null"
      :header-bg-variant="darkMode ? 'dark' : null"
      :body-bg-variant="darkMode ? 'dark' : null"
      :body-text-variant="darkMode ? 'white' : null"
      :footer-bg-variant="darkMode ? 'dark' : null"
      :footer-text-variant="darkMode ? 'white' : null">
      Foo
    </b-modal>

  </section>
</template>

<script>
import marked from 'marked'
import { collectionMetaTags } from '@/mixins/metaTags'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import InfiniteLoadAnnotations from '@/components/InfiniteLoadAnnotations'
import SearchTags from '@/components/data/SearchTags'

export default {
  layout: 'collection-tabs',

  mixins: [ fetchCollectionByName, collectionMetaTags ],

  data () {
    return {
      title: 'Browse',
      tagAnnotations: [],
      selectedTags: [],
      selectedImageData: {},
      previewModalId: 'image-preview-modal'
    }
  },

  components: {
    InfiniteLoadAnnotations,
    SearchTags
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

    selectedTagValues () {
      console.log(this.selectedTags.map(anno => anno.body.value), this.selectedTags.map(anno => (anno.body.value)))
      return this.selectedTags.map(anno => anno.body.value)
    },

    uniqueImageData () {
      const data = {}
      for (let anno of this.tagAnnotations) {
        const target = this.getImageSource(anno)
        if (data.hasOwnProperty(target)) {
          data[target].tags.push(anno.body.value)
        } else {
          data[target] = {
            tags: [anno.body.value],
            target: anno.target,
            manifest: anno.target === 'object'
              ? anno.scope
              : null
          }
        }
      }
      return Object.keys(data).map(key => {
        return {
          url: key,
          tags: data[key].tags,
          manifest: data[key].manifest,
          target: data[key].target
        }
      })
    },

    imageGridOptions () {
      return {
        layout: 'masonry',
        getFilterData: {
          filterByTag (itemElem) {
            const a = new Set(itemElem.tags)
            const b = new Set(this.selectedTags)
            const intersection = new Set([...a].filter(x => b.has(x)))
            console.log(intersection)
            return intersection.length > 0
          }
        }
      }
    }
  },

  methods: {
    /**
     * Expand image to show preview with details.
     */
    showImagePreview () {
      console.log('show preview')
    },

    /**
     * Set the image grid layout (after images have loaded).
     */
    layout () {
      this.$nextTick(() => {
        this.$refs.grid.layout('masonry')
      })
    },

    /**
     * Return the image source URI from an Annotation target.
     * @param {Object} tag
     *   The tag.
     */
    getImageSource (tag) {
      if (typeof tag.target === 'object') {
        // Return smaller thumbnails for IIIF images
        return tag.target.source.replace(/(max)(?!.*\1)/, '240,')
      }
      return tag.target
    },

    async getImageMetadata () {
      const containerIri = this.currentCollection.info.annotations.tags
      const idParts = containerIri.split('/')
      const containerId = idParts[idParts.length - 2]
      const metadata = {}
      let manifest = null

      // Get manifest
      if (this.selectedImageData.manifest) {
        try {
          manifest = await this.$axios.$get(this.selectedImageData.manifest)
        } catch (err) {
          this.$notifications.error({ message: err.message })
        }
        metadata.title = manifest.label
        metadata.description = manifest.label
      } else {
        metadata.title = `A ${this.currentCollection.name} image`
        metadata.description = 'Used in the projects on this platform'
      }

      // Get all tags (OK, a max of 1000 or whatever the page limit is)
      let tagsResponse = null
      try {
        tagsResponse = await this.$explicates.searchAnnotations({
          'collection.id': containerId,
          contains: {
            target: this.selectedImageData.target
          }
        })
      } catch (err) {
        this.$notifications.error({ message: err.message })
      }

      metadata.tags = tagsResponse.total === 0
        ? []
        : new Set(tagsResponse.first.items.map(anno => anno.body.value))

      return metadata
    }
  }
}
</script>
