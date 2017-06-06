<template>
  <section>
    <span v-html="background"></span>
  </section>
</template>

<script>
import marked from 'marked'

export default {
  data: function () {
    return {
      siteConfig: this.$store.state.siteConfig
    }
  },

  computed: {
    background: function () {
      return marked(this.siteConfig.background)
    }
  }
}
</script>
