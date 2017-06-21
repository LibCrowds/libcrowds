<template>

  <floating-tabs-layout :nav-items="navItems">

    <section id="results">
      <h2 class="text-center">Statistics</h2>
      <hr>
      <p class="text-center">
        Statistics page coming soon!
      </p>
    </section>

  </floating-tabs-layout>

</template>

<script>
import FloatingTabsLayout from '@/components/layouts/FloatingTabs'

export default {
  data: function () {
    return {
      navItems: [
      ]
    }
  },

  metaInfo: {
    title: 'Statistics'
  },

  components: {
    FloatingTabsLayout
  }
}
</script>
