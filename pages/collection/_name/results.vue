<template>

  <div id="collection-results">

    <section>
      <h2 class="text-center">Results</h2>
      <hr>
      <component
        :is="collectiononfig.resultsComponent"
        v-if="collectionConfig.resultsComponent">
      </component>
    </section>

  </div>

</template>

<script>
export default {
  props: {
    collectionConfig: {
      type: Object,
      required: true
    }
  }
}
</script>
