<template>
  <div id="main-layout" :style="mainStyle">
    <app-navbar></app-navbar>
    <main class="mt-md-4">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import AppNavbar from '@/components/AppNavbar'
import config from '@/config'

export default {
  data: function () {
    return {
      pbConfig: config.pybossaSites[ this.$store.state.route.params.sitename ]
    }
  },

  computed: {
    mainStyle: function () {
      return {
        backgroundImage: `url('${this.pbConfig.bgImg}')`
      }
    }
  },

  components: {
    AppNavbar
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

#main-layout {
  height: 100vh;
  overflow-y: auto;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
}

main {
  width: 90%;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 5rem;
}

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
