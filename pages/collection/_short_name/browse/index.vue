<template>
  <section id="collection-browse">
    <h1 class="text-center">{{ title }}</h1>
    <span v-if="pageContent">
      <span v-html="pageContent"></span>
      <hr class="mx-0">
    </span>

    <div v-if="hasTagAnnotations">
      <no-ssr>
        <ul
          v-masonry transition-duration="1s"
          item-selector=".img-grid-item"
          class="img-grid">
          <li
            v-for="(url, index) in uniqueImageURLs"
            :key="index"
            v-masonry-tile
            class="img-grid-item"
            column-width="#img-grid-column"
            gutter="#img-grid-gutter"
            @click="showImagePreview">
            <img :src="url" class="img-fluid">
            <div class="img-grid-expander">
              <div class="img-grid-expander-inner">
                <span class="img-grid-close"></span>
                <div class="img-grid-fullimg">
                  <div class="img-grid-loading"></div>
                  <img src="images/2.jpg">
                </div>
                <div class="img-grid-details">
                  <h3>Veggies sunt bona vobis</h3>
                  <p>Komatsuna prairie turnip wattle seed artichoke mustard horseradish taro rutabaga ricebean carrot black-eyed pea turnip greens beetroot yarrow watercress kombu.</p>
                  <a href="http://cargocollective.com/jaimemartinez/">Visit website</a>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </no-ssr>
      <div id="img-grid-column"></div>
      <div id="img-grid-gutter"></div>

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
.img-grid {
  .img-grid-item {
    list-style: none;
  }
  #img-grid-gutter {
    width: 12px;
  }

  #img-grid-column {
    max-width: 200px;
  }

  .img-grid-expander {
    position: absolute;
    background: #ddd;
    top: auto;
    left: 0;
    width: 100%;
    margin-top: 10px;
    text-align: left;
    height: 0;
    overflow: hidden;
  }

  .og-grid li.og-expanded > img::after {
    top: auto;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-bottom-color: #ddd;
    border-width: 15px;
    left: 50%;
    margin: -20px 0 0 -15px;
  }

  .img-grid-expander-inner {
    padding: 50px 30px;
    height: 100%;
  }

  .img-grid-close {
    position: absolute;
    width: 40px;
    height: 40px;
    top: 20px;
    right: 20px;
    cursor: pointer;
  }

  .img-grid-close::before,
  .img-grid-close::after {
    content: '';
    position: absolute;
    width: 100%;
    top: 50%;
    height: 1px;
    background: #888;
    transform: rotate(45deg);
  }

  .img-grid-close::after {
    transform: rotate(-45deg);
  }

  .img-grid-close:hover::before,
  .img-grid-close:hover::after {
    background: #333;
  }

  .img-grid-fullimg,
  .img-grid-details {
    width: 50%;
    float: left;
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  .img-grid-details {
    padding: 0 40px 0 20px;
  }

  .img-grid-fullimg {
    text-align: center;
  }

  .img-grid-fullimg img {
    display: inline-block;
    max-height: 100%;
    max-width: 100%;
  }
}
</style>
