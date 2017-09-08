<template>

  <div id="collection-about">

    <section>
      <h2 class="text-center">About {{ collectionConfig.name }}</h2>
      <hr>
      <span
        v-if="collectionConfig.about.intro"
        v-html="collectionConfig.about.intro">
      </span>
      <p v-else>
        *{{ siteConfig.brand }}* is a platform for hosting experimental
        crowdsourcing projects from {{ siteConfig.company }}. By contributing to
        the projects on this platform you will be directly helping to enable
        future research.
      </p>
      <div class="text-center mt-3">
        <b-button
          variant="success"
          size="lg"
          :to="{
            name: 'collection-contribute',
            params: {
              collectionname: collectionConfig.key
            }
          }">
          Get Started
        </b-button>
      </div>
    </section>

    <section
      v-for="(item, index) in collectionConfig.about.subsections"
      :key="item.id"
      :id="item.id">
      <h3 class="text-center">{{ item.title }}</h3>
      <span v-html="item.markdown"></span>

      <div
        v-if="index === collectionConfig.about.subsections.length - 1"
        class="text-center">
        <hr>
        <b-button
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
        </b-button>
      </div>

    </section>

  </div>

</template>

<script>
import siteConfig from '@/siteConfig'

export default {
  data: function () {
    return {
      siteConfig: siteConfig
    }
  },

  metaInfo () {
    return {
      title: 'About',
      description: `Learn more about the ${siteConfig.brand} platform`
    }
  },

  props: {
    collectionConfig: {
      type: Object,
      required: true
    }
  },

  computed: {
    navItems: function () {
      return this.collectionConfig.about.subsections.map((section) => {
        return { id: section.id, text: section.title }
      })
    }
  },

  mounted () {
    this.$emit('navupdated', this.navItems)
  }
}
</script>
