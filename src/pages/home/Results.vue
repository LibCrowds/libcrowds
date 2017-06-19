<template>

  <floating-tabs-layout :nav-items="navItems">

    <section id="results">
      <h2 class="text-center">Results</h2>
      <hr>
      <span v-if="resultsHtml" v-html="resultsHtml"></span>
      <p v-else class="text-center">
        Results page coming soon!
      </p>
    </section>

  </floating-tabs-layout>

</template>

<script id="#contact">
import config from '@/config'
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
    resultsHtml: function () {
      if ('resultsHtml' in config) {
        return this.config.resultsHtml
      }
      return ''
    }
  }
}
</script>
