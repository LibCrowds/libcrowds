<template>

  <floating-tabs-layout>

    <section>
      <h2 class="text-center">Results</h2>
      <hr>
      <component
        :is="collectiononfig.resultsComponent"
        v-if="collectionConfig.resultsComponent">
      </component>
    </section>

  </floating-tabs-layout>

</template>

<script>
import FloatingTabsLayout from '@/components/layouts/FloatingTabs'

export default {
  props: {
    collectionConfig: {
      type: Object,
      required: true
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
