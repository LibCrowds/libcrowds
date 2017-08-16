<template>

  <floating-tabs-layout :nav-items="navItems">

    <section>
      <h2 class="text-center">About</h2>
      <hr>
      <span v-if="config.about.intro" v-html="config.about.intro"></span>
      <p v-else>
        {{ config.brand }} is a platform for hosting experimental crowdsourcing
        projects from {{ config.company }}. By contributing to the projects
        on this platform you will be directly helping to enable future research.
      </p>
    </section>

    <section
      v-for="(item, index) in config.about.subsections"
      :key="item.id"
      :id="item.id">
      <h3 class="text-center">{{ item.title }}</h3>
      <span v-html="item.markdown"></span>
    </section>

  </floating-tabs-layout>

</template>

<script>
import FloatingTabsLayout from '@/components/layouts/FloatingTabs'

export default {
  data: function () {
    return {
      config: require(`@/settings/projects/${this.projectname}/config`)
    }
  },

  props: {
    projectName: {
      type: String,
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
