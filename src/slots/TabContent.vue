<template>
  <b-tabs>
    <slot name="item" v-for="tab in tabs" :text="item.text">
    <!-- fallback content here -->
    </slot>
  </b-tabs>    
  <b-tab title="Contact" class="p-3 p-md-5">
    <h2 class="text-uppercase text-center font-weight-bold display-4">
      <slot name="title"></slot>
    </h2>
    <slot name="content"></slot>
  </b-tab>
</template>

<script>
import config from '@/config'

export default {
  data: function () {
    return {
      config: config,
      pbConfig: config.pybossaSites[ this.$store.state.route.params.sitename ]
    }
  }
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
      padding: 0.35rem 0.75rem;
      color: $navbar-light-color;

      &.active {
        background-color: transparent;
        color: $brand-primary;
        transition: color 250ms;
      }
    }
  }

  .tab-content {
    background-color: $white;
  }
}
</style>
