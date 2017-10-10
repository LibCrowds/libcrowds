<template>
  <div id="dashboard-layout">
    <dashboard-sidenav
      :position="'side'"
      :navItems="dashboardNavItems">
    </dashboard-sidenav>

    <div class="dashboard">
      <app-navbar
        :currentUser="currentUser"
        :hideBrandBreakpoint="'lg'"
        :fixed="null">
      </app-navbar>
      <dashboard-sidenav
        :position="'top'"
        :navItems="dashboardNavItems">
      </dashboard-sidenav>
      <main>
        <div class="container px-lg-4 py-4">
          <transition name="fade" mode="out-in" appear>
            <router-view :currentUser="currentUser"></router-view>
          </transition>
        </div>
      </main>
      <dashboard-footer></dashboard-footer>
    </div>
  </div>
</template>

<script>
import DashboardFooter from '@/components/footers/DashboardFooter'
import AppNavbar from '@/components/navs/AppNavbar'
import DashboardSidenav from '@/components/navs/DashboardSidenav'

export default {
  props: {
    currentUser: {
      type: Object,
      required: true
    },
    dashboardNavItems: {
      type: Array,
      required: true
    }
  },

  components: {
    AppNavbar,
    DashboardFooter,
    DashboardSidenav
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/main';

#dashboard-layout {
  height: 100vh;
  width: auto;

  main {
    flex: 1 1 auto;
    background-image: url('../assets/img/geometry.png');
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
    transition: opacity 150ms ease-out;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
