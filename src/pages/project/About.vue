<template>

  <floating-tabs-layout :nav-items="navItems">

    <section>
      <h2 class="text-center">About</h2>
      <hr>
      <span
        v-if="projectConfig.about.intro"
        v-html="projectConfig.about.intro">
      </span>
      <p v-else>
        {{ config.name }} is a platform for hosting experimental crowdsourcing
        projects from {{ siteConfig.company }}. By contributing to the projects
        on this platform you will be directly helping to enable future research.
      </p>
    </section>

    <section
      v-for="(item, index) in projectConfig.about.subsections"
      :key="item.id"
      :id="item.id">
      <h3 class="text-center">{{ item.title }}</h3>
      <span v-html="item.markdown"></span>
    </section>

  </floating-tabs-layout>

</template>

<script>
import siteConfig from '@/settings/siteConfig'
import FloatingTabsLayout from '@/components/layouts/FloatingTabs'

export default {
  props: {
    siteConfig: siteConfig,
    projectConfig: {
      type: Object,
      required: true
    }
  },

  metaInfo: {
    title: 'About'
  },

  components: {
    FloatingTabsLayout
  },

  computed: {
    navItems: function () {
      return this.config.about.subsections.map((section) => {
        return { id: section.id, text: section.title }
      })
    }
  }
}
</script>
