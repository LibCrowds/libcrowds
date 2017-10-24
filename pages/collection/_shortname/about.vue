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
          name: 'collection-shortname-projects',
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

  computed: {
    pageContent () {
      marked(this.collection.info.content.about)
    }
  },

  mixins: [ loadAsyncCollection ],

  methods: {
    /**
     * Markdown processor.
     */
    marked
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
