<template>
  <div id="dashboard-layout">
    <dashboard-sidenav
      :position="'side'"
      :navItems="adminNavItems">
    </dashboard-sidenav>

    <div class="dashboard">
      <app-navbar
        :hideBrandBreakpoint="'lg'"
        :fixed="null">
      </app-navbar>
      <dashboard-sidenav
        :position="'top'"
        :navItems="adminNavItems">
      </dashboard-sidenav>
      <main class="bg-faded">
        <div class="container p-4">
          <router-view></router-view>
        </div>
      </main>
      <app-footer-slim></app-footer-slim>
    </div>
  </div>
</template>

<script>
import AppFooterSlim from '@/components/footers/AppFooterSlim'
import AppNavbar from '@/components/navs/AppNavbar'
import DashboardSidenav from '@/components/navs/DashboardSidenav'

export default {
  data: function () {
    return {
      adminNavItems: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          link: {
            name: 'admin-dashboard'
          }
        },
        {
          id: 'featured',
          label: 'Featured Projects',
          link: {
            name: 'admin-featured'
          }
        },
        {
          id: 'categories',
          label: 'Categories',
          link: {
            name: 'admin-categories'
          }
        },
        {
          id: 'administrators',
          label: 'Administrators',
          link: {
            name: 'admin-administrators'
          }
        },
        {
          id: 'announcements',
          label: 'Announcements',
          link: {
            name: 'admin-announcements'
          }
        },
        {
          id: 'export-users',
          label: 'Export Users',
          link: '#'
        },
        {
          id: 'background-jobs',
          label: 'Background Jobs',
          link: '#'
        }
      ]
    }
  },

  props: {
    dashboard: {
      type: String,
      required: true,
      validator: value => {
        const validDashboards = [
          'admin',
          'project'
        ]
        return validDashboards.indexOf(value) > -1
      }
    }
  },

  components: {
    AppNavbar,
    AppFooterSlim,
    DashboardSidenav
  },

  computed: {
    navItems: function () {
      if (this.dashboard === 'admin') {
        return this.adminNavItems
      } else if (this.dashboard === 'project') {
        return this.projectNavItems
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/main';

#dashboard-layout {
  height: 100vh;
  width: 100vw;

  main {
    flex: 1 1 auto;
  }

  .dashboard {
    display: flex;
    flex-direction: column;
    height: 100%;

    @include media-breakpoint-up(lg) {
      z-index: 2;
      max-height: 100%;
      float: right;
      width: calc(100% - 260px);
    }
  }
}
</style>
