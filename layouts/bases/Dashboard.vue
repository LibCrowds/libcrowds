<template>
  <div id="dashboard-layout-base" :class="darkMode ? 'dark-mode' : null">

    <side-navbar
      v-model="showSideNav"
      :nav-items="navItems"
      @menuclick="showSideNav = false">
    </side-navbar>

    <div :class="dashboardClass">

      <top-navbar
        show-help
        :navbar-brand="localConfig.brand"
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
import SideNavbar from '@/components/navbars/Side'

export default {
  data () {
    return {
      localConfig: localConfig,
      showSideNav: true
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
    SideNavbar,
    DashboardFooter
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },

    dashboardClass () {
      return {
        'dashboard': true,
        'dashboard-dark': this.darkMode
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/style/settings';

#dashboard-layout-base {
  display: flex;
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
    width: 100%;
    background-image: url('~/assets/img/geometry.png');

    &.dashboard-dark {
      background-image: url('~/assets/img/geometry-dark.png');
    }

    @include media-breakpoint-up(lg) {
      z-index: 2;
      height: 100vh;
      float: right;
    }
  }
}
</style>
