<template>

  <floating-tabs-layout :nav-items="navItems">

    <section id="about">
      <h2 class="text-center">Results</h2>
      <hr>
      <span v-html="results"></span>
    </section>

  </floating-tabs-layout>

</template>

<script id="#contact">
import marked from 'marked'
import FloatingTabsLayout from '@/components/layouts/FloatingTabs'

export default {
  data: function () {
    return {
      navItems: [
        { id: 'top', text: 'Top' }
      ]
    }
  },

  metaInfo: {
    title: 'Results'
  },

  components: {
    FloatingTabsLayout
  },

  computed: {
    results: function () {
      return marked(this.siteConfig.results)
    }
  }
}
</script>
