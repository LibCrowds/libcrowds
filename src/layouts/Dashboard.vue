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
        <div class="container py-4">
          <router-view :currentUser="currentUser"></router-view>
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
      width: calc(100% - 260px);
    }
  }
}
</style>
