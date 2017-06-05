<template>
  <b-tabs pills>
    <b-tab v-for="tab in tabs" :title="tab.title" class="p-3 p-md-5" :key="tab.title">
      <h2 class="text-uppercase text-center font-weight-bold display-4">
        {{ tab.title }}
      </h2>
      <hr>
      <component v-bind:is="tab.content"></component>
    </b-tab>
  </b-tabs>
</template>

<script>
export default {
  props: [
    'tabs'
  ]
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

.tabs {
  .nav-pills {
    padding: $navbar-padding-y $navbar-padding-x;
    background-color: rgba($gray-lighter, 0.85);

    .nav-link {
      color: $navbar-light-color;
    }
  }

  .tab-content {
    background-color: $white;
  }
}
</style>
