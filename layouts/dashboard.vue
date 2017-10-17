<template>
  <div id="dashboard-layout">

    <dashboard-sidenav
      position="side"
      :nav-items="dashboardNavItems">
    </dashboard-sidenav>

    <div class="dashboard">

      <app-navbar
        hide-brand-breakpoint="lg"
        :fixed="null">
      </app-navbar>

      <dashboard-navbar
        position="top"
        :nav-items="dashboardNavItems">
      </dashboard-navbar>

      <main>
        <div class="container px-lg-4 py-4">
          <transition name="fade" mode="out-in" appear>
            <nuxt></nuxt>
          </transition>
        </div>
      </main>

      <dashboard-navbar></dashboard-navbar>

      <notifications position="bottom left"></notifications>

    </div>
  </div>
</template>

<script>
import DashboardFooter from '@/components/footers/Dashboard'
import AppNavbar from '@/components/navbars/App'
import DashboardNavbar from '@/components/navbars/Dashboard'

export default {
  computed: {
    dashboardNavItems () {
      if (this.$route.path.startsWith('/account')) {
        return [
          { name: 'account-username-settings-profile', label: 'Profile' },
          { name: 'account-username-settings-api', label: 'API' },
          { name: 'account-username-settings-avatar', label: 'Avatar' },
          { name: 'account-username-settings-security', label: 'Security' }
        ]
      } else if (this.$route.path.startsWith('/admin')) {
        return [
          { name: 'admin-dashboard', label: 'Dashboard' },
          { name: 'admin-featured', label: 'Featured Projects' },
          { name: 'admin-categories', label: 'Categories' },
          { name: 'admin-users', label: 'Users' },
          { name: 'admin-announcements', label: 'Announcements' },
          { name: 'admin-jobs', label: 'Background Jobs' }
        ]
      } else if (this.$route.path.startsWith('/help')) {
        return [
          { name: 'help-api', label: 'API' },
          { name: 'help-cookies', label: 'Cookies Policy' },
          { name: 'help-privacy', label: 'Privacy Policy' },
          { name: 'help-tos', label: 'Terms of Service' }
        ]
      } else if (this.$route.path.startsWith('/project')) {
        return [
          { name: 'project-settings', label: 'Settings' },
          { name: 'project-thumbnail', label: 'Thumbnail' }
        ]
      }
      return []
    }
  },

  components: {
    AppNavbar,
    DashboardFooter,
    DashboardNavbar
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/style/main';

#dashboard-layout {
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
