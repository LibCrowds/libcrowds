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
        <a
          slot="right"
          v-if="localConfig.docs"
          :href="localConfig.docs"
          target="_blank"
          class="nav-link d-flex px-1">
          <icon name="question-circle"></icon>
        </a>
      </app-navbar>

      <dashboard-navbar
        position="top"
        :nav-items="navItems">
      </dashboard-navbar>

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
import AppNavbar from '@/components/navbars/App'
import DashboardNavbar from '@/components/navbars/Dashboard'
import 'vue-awesome/icons/question-circle'

export default {
  data () {
    return {
      localConfig: localConfig
    }
  },

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
    overflow-y: auto;
  }

  .dashboard {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-image: url('~/assets/img/geometry.png');

    @include media-breakpoint-up(lg) {
      z-index: 2;
      height: 100vh;
      float: right;
      width: calc(100% - #{$sidebar-width});
    }
  }
}
</style>
