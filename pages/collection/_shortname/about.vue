<template>
  <div id="collection-about">

    <section>
      <h2 class="text-center">About {{ collection.name }}</h2>
      <hr>
      <span v-html="intro"></span>
      <div class="text-center mt-3">
        <b-btn
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
    </section>

    <section
      v-for="(section, index) in sections"
      :key="index"
      :id="index">
      <span v-html="section"></span>
      <div
        v-if="index === sections.length - 1"
        class="text-center">
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
    </section>

  </div>
</template>

<script>
import marked from 'marked'
import { nextUntil } from '@/utils/nextUntil'
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

  computed: {
    navItems () {
      const subsections = this.getCustom('subsections')
      if (!subsections) {
        return []
      }
      return subsections.map((section) => {
        return { id: section.id, text: section.title }
      })
    },

    parse (markdown) {
      console.log(markdown, typeof markdown)
      const content = marked(markdown)
      const parser = new DOMParser()
      const doc = parser.parseFromString(content, 'text/html')
      return doc
    },

    sections () {
      let sections = []
      const doc = this.parse(this.collection.info.content.about)
      const headers = doc.querySelector('h1,h2,h3')
      console.log(headers)
      let section = nextUntil(doc, 'h1,h2,h3')
      sections.push(section)
      console.log(section)
    },

    intro () {
      return ''
    }
  },

  created () {
    this.sections()
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
