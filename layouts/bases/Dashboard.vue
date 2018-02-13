<template>
  <div id="dashboard-layout-base" :class="darkMode ? 'dark-mode' : null">

    <side-nav
      v-model="showSideNav"
      :nav-items="navItems"
      @menuclick="showSideNav = false">
    </side-nav>

    <dashboard-navbar
      :nav-items="navItems">
    </dashboard-navbar>

    <div :class="darkMode ? 'dashboard dashboard-dark' : 'dashboard'">

      <top-navbar
        show-help
        @menuclick="showSideNav = !showSideNav">
      </top-navbar>

      <main class="container-fluid px-lg-4 py-4">
        <transition name="fade" mode="out-in" appear>
          <nuxt></nuxt>
        </transition>
      </main>

      <dashboard-footer></dashboard-footer>

    </div>
  </div>
</template>

<script>
import localConfig from '@/local.config'
import DashboardFooter from '@/components/footers/Dashboard'
import TopNavbar from '@/components/navbars/Top'
import SideNav from '@/components/navbars/Side'
import DashboardNavbar from '@/components/navbars/Dashboard'

export default {
  data () {
    return {
      localConfig: localConfig,
      showSideNav: false
    }
  },

  props: {
    navItems: {
      type: Array,
      required: true
    },
    titleBase: {
      type: String,
      default: null
    }
  },

  components: {
    TopNavbar,
    SideNav,
    DashboardFooter,
    DashboardNavbar
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/style/settings';

#dashboard-layout-base {
  height: 100vh;
  width: auto;

  main {
    flex: 1 1 auto;
    overflow-y: auto;
  }

  .dashboard {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-image: url('~/assets/img/geometry.png');

    &.dashboard-dark {
      background-image: url('~/assets/img/geometry-dark.png');
    }

    @include media-breakpoint-up(lg) {
      z-index: 2;
      height: 100vh;
      float: right;
      width: calc(100% - #{$sidebar-width});
    }
  }
}
</style>
