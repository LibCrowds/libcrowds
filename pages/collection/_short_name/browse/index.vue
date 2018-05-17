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
        class="mb-2">
      </search-tags>

      <div class="img-grid">
        <no-ssr>
          <isotope
            ref="grid"
            v-images-loaded:on.progress="setGridLayout"
            :options="imageGridOptions"
            :list="uniqueImageData">
            <img
              v-for="(item, index) in uniqueImageData"
              :key="index"
              :src="item.thumbnail"
              class="img-grid-item img-fluid"
              @click="showPreview(item)">
          </isotope>
        </no-ssr>
      </div>

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
      ref="previewModal"
      title=""
      size="lg"
      hide-footer
      :header-bg-variant="darkMode ? 'dark' : 'light'"
      :body-bg-variant="darkMode ? 'dark' : 'light'"
      :footer-bg-variant="darkMode ? 'dark' : 'light'"
      :header-text-variant="darkMode ? 'white' : null"
      :body-text-variant="darkMode ? 'white' : null"
      :footer-text-variant="darkMode ? 'white' : null"
      :header-border-variant="darkMode ? 'dark' : 'light'"
      @hidden="selectedImageData = {}">
      <b-container
        fluid
        class="bg-muted"
        v-if="selectedImageData.url">
        <b-row>
          <b-col xs="12" lg="6" class="text-center">
              <img
                :src="selectedImageData.url"
                class="img-fluid pb-4 px-4 pt-1">
          </b-col>
          <b-col
            xs="12"
            class="d-lg-flex justify-content-between flex-column
              my-2 mb-4 text-center text-lg-left">
            <div class="mb-3">
              <h5>
                {{ selectedImageData.title }}
              </h5>
              <p class="text-muted">
                {{ selectedImageData.description }}
              </p>
            </div>
            <div></div>
            <div class="mb-3 text-center text-lg-left">
              <b-btn
                :variant="darkMode ? 'secondary' : 'outline-dark'"
                size="lg"
                :disabled="!selectedImageData.link"
                :href="selectedImageData.link" target="_blank">
                <span class="d-flex align-items-center">
                  <icon name="arrow-right" class="mr-1"></icon>
                  Open the viewer
                </span>
              </b-btn>
            </div>
            <div>
              <h6 class="mb-1">Tags:</h6>
              <item-tags-list
                :container-iri="currentCollection.info.annotations.tags"
                :source-iri="selectedImageData.url"
                :scope-iri="selectedImageData.manifest"
                type="Image">
              </item-tags-list>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>

  </section>
</template>

<script>
import marked from 'marked'
import 'vue-awesome/icons/arrow-right'
import { collectionMetaTags } from '@/mixins/metaTags'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import InfiniteLoadAnnotations from '@/components/InfiniteLoadAnnotations'
import ItemTagsList from '@/components/lists/ItemTags'
import SearchTags from '@/components/data/SearchTags'

export default {
  layout: 'collection-tabs',

  mixins: [ fetchCollectionByName, collectionMetaTags ],

  data () {
    return {
      title: 'Browse',
      tagAnnotations: [],
      selectedTags: [],
      selectedImageData: {}
    }
  },

  components: {
    InfiniteLoadAnnotations,
    ItemTagsList,
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
        const source = typeof anno.target === 'object'
          ? anno.target.source
          : anno.target
        if (data.hasOwnProperty(source)) {
          data[source].tags.push(anno.body.value)
        } else {
          data[source] = {
            tags: [anno.body.value],
            manifest: typeof anno.target === 'object'
              ? anno.target.scope
              : '',
            thumbnail: this.getThumbnail(anno)
          }
        }
      }

      return Object.keys(data).map(key => {
        return {
          url: key,
          tags: data[key].tags,
          manifest: data[key].manifest,
          thumbnail: data[key].thumbnail
        }
      })
    },

    imageGridOptions () {
      return {
        layout: 'masonry',
        itemSelector: '.img-grid-item',
        masonry: {
          gutter: 10
        },
        getFilterData: {
          filterByTag (itemElem) {
            console.log('selectedTags', this.selectedTags)
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
     * Set the image grid layout (after images have loaded).
     */
    setGridLayout () {
      this.$nextTick(() => {
        this.$refs.grid.layout('masonry')
      })
    },

    /**
     * Return a thumbnail image URI from an Annotation target.
     * @param {Object} tag
     *   The tag.
     */
    getThumbnail (tag) {
      if (typeof tag.target === 'object') {
        // Return smaller thumbnails for IIIF images
        return tag.target.source.replace(/(max)(?!.*\1)/, '240,')
      }
      return tag.target
    },

    /**
     * Lookup additional metadata for an item.
     *
     * Use the IIIF manifest if available, otherwise revert to basic defaults.
     * @param {Object} item
     *   The item.
     */
    loadMetadata (item) {
      return new Promise((resolve, reject) => {
        if (!item.manifest.length) {
          resolve({
            title: `${this.currentCollection.name} image`,
            description: 'Used in one of the projects on this platform'
          })
          return
        }

        this.$axios.$get(item.manifest, {
          headers: {
            'Content-type': 'text/plain' // to avoid CORS preflight
          }
        }).then(data => {
          resolve({
            title: data.label,
            description: data.description
          })
        }).catch(err => {
          reject(err)
        })
      })
    },

    /**
    * Lookup the matching shareable link for an item.
    * @param {Object} item
    *   The item.
    */
    loadViewerLink (item) {
      return new Promise((resolve, reject) => {
        this.$axios.$get('/api/task', {
          params: {
            info: {
              url: item.url
            }
          }
        }).then(data => {
          if (data.length) {
            resolve(data[0].info.link)
          } else {
            reject(new Error('Related link not be found'))
          }
        }).catch(err => {
          reject(err)
        })
      })
    },

    /**
     * Show a preview of the selected item.
     *
     * Collect the additional metadata before loading it into the modal.
     * @param {Object} item
     *   The selected item.
     */
    showPreview (item) {
      const loadMetadataPromise = this.loadMetadata(item)
      const loadViewerLinkPromise = this.loadViewerLink(item)
      Promise.all([loadMetadataPromise, loadViewerLinkPromise]).then(values => {
        item.title = values[0].title
        item.description = values[0].description
        item.link = values[1]
        this.selectedImageData = item
        console.log(this.selectedImageData)
        this.$refs.previewModal.show()
      }).catch(err => {
        console.log(err)
        this.$notifications.error({
          message: `Sorry, we're having trouble loading the additional metadata
            required to display the preview for this item. We will get this
            fixed as soon as possible. In the meantime, you can continue using
            the rest of the platform as normal.`
        })
      })
    }
  }
}
</script>

<style lang="scss">
.img-grid {
  .img-grid-item {
    cursor: pointer;
    width: 100%;

    @include media-breakpoint-up(md) {
      width: 48%;
    }

    @include media-breakpoint-up(lg) {
      width: 23%;
    }

    @include media-breakpoint-up(xl) {
      width: 18%;
    }
  }
}
</style>