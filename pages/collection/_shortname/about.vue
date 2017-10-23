<template>
  <div id="collection-about">

    <h1 class="text-center">About {{ collection.name }}</h1>
    <span v-html="marked(collection.info.content.about)"></span>

    <div class="text-center do-not-wrap">
      <hr>
      <b-btn
        class="mt-1"
        variant="success"
        size="lg"
        :to="{
          name: 'collection-shortname-contribute',
          params: {
            shortname: collection.short_name
          }
        }">
        Get Started
      </b-btn>
    </div>
  </div>
</template>

<script>
import marked from 'marked'
import { wrapContent } from '@/utils/wrapContent'
import { loadAsyncCollection } from '@/mixins/loadAsyncCollection'
import localConfig from '@/local.config'

export default {
  layout: 'collection-tabs',

  data () {
    return {
      localConfig: localConfig
    }
  },

  head () {
    return {
      title: 'About',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Learn more about ${this.collection.brand}`
        }
      ]
    }
  },

  mixins: [ loadAsyncCollection ],

  methods: {
    /**
     * Markdown processor.
     */
    marked
  },

  mounted () {
    const content = document.querySelector('#collection-about')
    const wrapper = document.createElement('section')
    return wrapContent(content, 'h2', wrapper)
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
