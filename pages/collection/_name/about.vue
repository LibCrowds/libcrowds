<template>
  <div id="collection-about">

    <section>
      <h2 class="text-center">About {{ collectionConfig.name }}</h2>
      <hr>
      <span v-html="intro"></span>
      <div class="text-center mt-3">
        <b-btn
          variant="success"
          size="lg"
          :to="{
            name: 'collection-contribute',
            params: {
              collectionname: collectionConfig.key
            }
          }">
          Get Started
        </b-btn>
      </div>
    </section>

    <section
      v-for="(item, index) in subsections"
      :key="item.id"
      :id="item.id">
      <h3 class="text-center">{{ item.title }}</h3>
      <span v-html="item.markdown"></span>
      <div
        v-if="index === subsections.length - 1"
        class="text-center">
        <hr>
        <b-btn
          class="mt-1"
          variant="success"
          size="lg"
          :to="{
            name: 'collection-contribute',
            params: {
              collectionname: collectionConfig.key
            }
          }">
          Get Started
        </b-btn>
      </div>
    </section>

  </div>
</template>

<script>
import localConfig from '@/local.config'

export default {
  layout: 'tabs',

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
          name: 'description',
          content: `Learn more about the ${localConfig.brand} platform`
        }
      ]
    }
  },

  props: {
    collectionConfig: {
      type: Object,
      required: true
    }
  },

  methods: {
    /**
     * Get a custom about config value.
     * @param {String} key
     *   The key for the about config value.
     */
    getCustom (key) {
      if (!(this.collectionConfig.hasOwnProperty('about'))) {
        return null
      }
      if (!(this.collectionConfig.about.hasOwnProperty(key))) {
        return null
      }
      return this.collectionConfig.about[key]
    }
  },

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

    subsections () {
      return this.getCustom('subsections') || []
    },

    intro () {
      const intro = this.getCustom('intro')
      return intro || `${localConfig.brand} is a platform for hosting
        experimental crowdsourcing projects from ${localConfig.brand}. By
        contributing to the projects on this platform you will be directly
        helping to enable future research.`
    }
  },

  created () {
    this.$emit('navupdated', this.navItems)
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
