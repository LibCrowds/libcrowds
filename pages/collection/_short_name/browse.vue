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
        @change="updateFilters"
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
              class="img-grid-item img-fluid my-1"
              @click="showPreview(item)">
          </isotope>
        </no-ssr>
      </div>

      <infinite-load-annotations
        ref="infiniteload"
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
      id="preview-modal"
      title=""
      size="lg"
      hide-footer
      hide-header
      :header-bg-variant="darkMode ? 'dark' : 'light'"
      :body-bg-variant="darkMode ? 'dark' : 'light'"
      :footer-bg-variant="darkMode ? 'dark' : 'light'"
      :header-text-variant="darkMode ? 'white' : null"
      :body-text-variant="darkMode ? 'white' : null"
      :footer-text-variant="darkMode ? 'white' : null"
      :header-border-variant="darkMode ? 'dark' : 'light'"
      @hidden="selectedItem = {}">
      <b-container
        fluid
        class="bg-muted"
        v-if="selectedItem.url">
        <b-btn
          class="fixed-close"
          @click="$refs.previewModal.hide()">
          <icon name="times"></icon>
        </b-btn>
        <b-row>
          <b-col xs="12" lg="6" class="text-center">
              <img
                :src="selectedItem.thumbnail"
                class="img-fluid m-4">
          </b-col>
          <b-col
            xs="12"
            lg="6"
            class="d-lg-flex justify-content-between flex-column
              my-4 text-center text-lg-left">
            <div class="mb-3">
              <h5>
                {{ selectedItem.title }}
              </h5>
              <p class="text-muted">
                {{ selectedItem.description }}
              </p>
            </div>
            <div></div>
            <div
              class="mb-3 text-center text-lg-left"
              v-if="selectedItem.related">
              <b-btn
                v-for="(related, idx) in selectedItem.related"
                :key="idx"
                :variant="darkMode ? 'secondary' : 'outline-dark'"
                size="lg"
                :href="related.id || related['@id']" target="_blank">
                <span class="d-flex align-items-center">
                  <icon name="arrow-right" class="mr-1"></icon>
                  {{ related.label }}
                </span>
              </b-btn>
            </div>
            <div>
              <h6 class="mb-1">Tags:</h6>
              <item-tags-list
                :container-iri="currentCollection.info.annotations.tags"
                :source-iri="selectedItem.url"
                :scope-iri="selectedItem.manifest"
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
import 'vue-awesome/icons/times'
import 'vue-awesome/icons/arrow-right'
import { collectionMetaTags } from '@/mixins/metaTags'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import InfiniteLoadAnnotations from '@/components/infiniteload/Annotations'
import ItemTagsList from '@/components/lists/ItemTags'
import SearchTags from '@/components/data/SearchTags'

export default {
  layout: 'collection-tabs',

  mixins: [ fetchCollectionByName, collectionMetaTags ],

  data () {
    return {
      title: 'Browse Tags',
      tagAnnotations: [],
      selectedTags: [],
      selectedItem: {}
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
          title: `${this.currentCollection.name} image`,
          description: 'Used in a project on this platform',
          tags: data[key].tags,
          manifest: data[key].manifest,
          thumbnail: data[key].thumbnail
        }
      })
    },

    imageGridOptions () {
      const _this = this
      return {
        layout: 'masonry',
        itemSelector: '.img-grid-item',
        masonry: {
          gutter: 10
        },
        getFilterData: {
          filterByTag (itemElem) {
            const selectedTagValues = _this.selectedTags.map(anno => {
              return anno.body.value
            })
            const a = new Set(itemElem.tags)
            const b = new Set(selectedTagValues)
            const intersection = new Set([...a].filter(x => b.has(x)))
            return b.size === 0 || intersection.size > 0
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
     * Show a preview of the selected item.
     *
     * Collect the additional metadata before loading it into the modal.
     * @param {Object} item
     *   The selected item.
     */
    showPreview (item) {
      this.$axios.$get(`/lc/proxy/`, {
        params: {
          url: item.manifest
        }
      }).then(data => {
        item.title = data.label
        item.description = data.description
        item.related = data.hasOwnProperty('related')
          ? Array.isArray(data.related)
            ? data.related
            : [data.related]
          : []
      }).finally(() => {
        this.selectedItem = item
        this.$refs.previewModal.show()
      })
    },

    /**
     * Update filters.
     * @param {Array} tags
     *   The selected tags.
     */
    updateFilters (tags) {
      this.selectedTags = tags
      this.$refs.grid.filter('filterByTag')
      this.$refs.infiniteload.load()
    }
  },

  mounted () {
    const nodes = document.querySelectorAll('.collection-nav-item')
    this.$store.dispatch('UPDATE_COLLECTION_NAV_ITEMS', nodes)
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

#preview-modal {
  .fixed-close {
    color: $gray-600;
    background: transparent;
    border: none;
    position: fixed;
    right: 20px;
    top: 20px;

    &:hover {
      color: $gray-600;
      background: transparent;
      border: none;
    }
  }
}
</style>