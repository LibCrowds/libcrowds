<template>
  <div id="dashboard-layout-base">

    <dashboard-navbar
      position="side"
      :nav-items="navItems">
    </dashboard-navbar>

    <div class="dashboard">

      <app-navbar
        hide-brand-breakpoint="lg"
        :fixed="null"
        :current-user="currentUser">
      </app-navbar>

      <dashboard-navbar
        position="top"
        :nav-items="navItems">
      </dashboard-navbar>

      <main>
        <div class="container px-lg-4 py-4">
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
import DashboardFooter from '@/components/footers/Dashboard'
import AppNavbar from '@/components/navbars/App'
import DashboardNavbar from '@/components/navbars/Dashboard'

export default {
  props: {
    navItems: {
      type: Array,
      required: true
    }
  },

  components: {
    AppNavbar,
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
    background-image: url('~/assets/img/geometry.png');
    overflow-y: auto;
  }

  .dashboard {
    display: flex;
    flex-direction: column;
    height: 100%;

    @include media-breakpoint-up(lg) {
      z-index: 2;
      height: 100vh;
      float: right;
      width: calc(100% - #{$sidebar-width});
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 250ms ease-out;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
