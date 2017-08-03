<template>

  <floating-tabs-layout :nav-items="navItems">

    <section>
      <h2 class="text-center">Results</h2>
      <hr>
      <component
        :is="config.resultsComponent"
        v-if="config.resultsComponent">
      </component>
    </section>

  </floating-tabs-layout>

</template>

<script>
import config from '@/config'
import FloatingTabsLayout from '@/components/layouts/FloatingTabs'

export default {
  data: function () {
    return {
      config: config,
      navItems: []
    }
  },

  metaInfo: {
    title: 'Results'
  },

  components: {
    FloatingTabsLayout
  }
}
</script>
