<template>
  <section>
    <span v-html="background"></span>
  </section>
</template>

<script>
import config from '@/config'
import marked from 'marked'

export default {
  data: function () {
    return {
      pbConfig: config.pybossaSites[ this.$store.state.route.params.sitename ]
    }
  },

  computed: {
    background: function () {
      return marked(this.pbConfig.background)
    }
  }
}
</script>
