<template>
  <div id="dashboard-layout-base" :class="darkMode ? 'dark-mode' : null">

    <side-navbar
      v-model="showSideNav"
      :dark="darkMode"
      :nav-items="navItems"
      @close="showSideNav = false"
      @itemclick="onSidebarItemClick">
    </side-navbar>

    <div :class="dashboardClass">

      <top-navbar
        show-help
        :dark="darkMode"
        :navbar-brand="localConfig.brand"
        @menuclick="showSideNav = !showSideNav"
        @itemclick="showSideNav = false">
      </top-navbar>

      <main>
        <slot name="message"></slot>
        <div class="container-fluid px-lg-4 py-4">
          <transition name="fade" mode="out-in" appear>
            <nuxt></nuxt>
          </transition>
        </div>
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
      type: Object,
      required: true
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
  },

  methods: {
    /**
     * Handle sidebar click.
     *
     * Collapse if the screen is small.
     * @param {Object} route
     *   The route being navigated to.
     */
    onSidebarItemClick (route) {
      if (window.innerWidth < 576) {
        this.showSideNav = false
      }
    }
  },

  mounted () {
    if (window.innerWidth < 576) {
      this.showSideNav = false
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
    overflow: hidden;
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
