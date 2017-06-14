<template>

  <floating-tabs :nav-items="navItems">

    <section id="about">
      <h2 class="text-center">Results</h2>
      <hr>
      <span v-html="results"></span>
    </section>

  </floating-tabs>

</template>

<script id="#contact">
import marked from 'marked'
import FloatingTabs from '@/components/layouts/FloatingTabs'

export default {
  data: function () {
    return {
      siteConfig: this.$store.state.siteConfig,
      navItems: [
        { id: 'top', text: 'Top' }
      ]
    }
  },

  components: {
    FloatingTabs
  },

  computed: {
    results: function () {
      return marked(this.siteConfig.results)
    }
  }
}
</script>
