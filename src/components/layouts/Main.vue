<template>
  <div id="main-layout" :style="mainStyle">
    <app-navbar></app-navbar>
    <main class="mt-md-4">
      <div class="container">
        <router-view></router-view>
      </div>
    </main>
    <app-footer></app-footer>
  </div>
</template>

<script>
import AppNavbar from '@/components/AppNavbar'
import AppFooter from '@/components/AppFooter'
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
    AppNavbar,
    AppFooter
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

#main-layout {
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
}

main {
  flex: 1 1 auto;
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
