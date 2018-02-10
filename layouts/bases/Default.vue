<template>
  <div id="default-layout-base">
    <div id="custom-background" :style="bgStyle"></div>

    <side-nav
      v-model="showSideNav"
      @menuclick="showSideNav = false">
    </side-nav>

    <div id="app-right">
      <top-navbar
        :fixed="fixed"
        :current-user="currentUser"
        @menuclick="showSideNav = !showSideNav">
        <div
          slot="left"
          class="d-none d-lg-block ml-2"
          v-if="titleBase">
          {{ titleBase }}
        </div>
      </top-navbar>

      <main :class="containerClass">
        <transition name="fade" mode="out-in" appear>
          <nuxt></nuxt>
        </transition>
      </main>

      <dashboard-footer
        v-if="slimFooter">
      </dashboard-footer>

    </div>

    <app-footer
      v-if="!slimFooter"
      :collections="publishedCollections">
    </app-footer>

    <div :class="backdropClassObj" @click="showSideNav = false"></div>

  </div>
</template>

<script>
import 'vue-awesome/icons/question-circle'
import localConfig from '@/local.config'
import AppFooter from '@/components/footers/App'
import DashboardFooter from '@/components/footers/Dashboard'
import TopNavbar from '@/components/navbars/Top'
import SideNav from '@/components/navbars/Side'

export default {
  data () {
    return {
      localConfig: localConfig,
      showSideNav: false
    }
  },

  components: {
    TopNavbar,
    AppFooter,
    DashboardFooter,
    SideNav
  },

  props: {
    showHelp: {
      type: Boolean,
      default: false
    },
    slimFooter: {
      type: Boolean,
      default: false
    },
    contained: {
      type: Boolean,
      default: false
    },
    titleBase: {
      type: String,
      required: false
    },
    fixed: {
      type: String,
      default: null
    },
    collection: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    publishedCollections () {
      return this.$store.state.publishedCollections
    },

    currentUser () {
      return this.$store.state.currentUser
    },

    appRightClass () {
      return {
        fixed: this.showSideNav
      }
    },

    containerClass () {
      return {
        'container-fluid': this.contained
      }
    },

    backdropClassObj () {
      return {
        'modal-backdrop': this.showSideNav,
        'fade': this.showSideNav,
        'show': this.showSideNav
      }
    },

    bgStyle () {
      if (!this.collection.info || !this.collection.info.background) {
        return
      }
      return {
        backgroundImage: `url(${this.collection.info.background})`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/style/settings';

#default-layout-base {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  main {
    flex: 1 1 auto;
  }

  .modal-backdrop {
    background-color: rgba($black, 0.35);
  }

  #app-right {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .fixed {
    height: 100vh;
    width: auto;

    main {
      overflow-y: auto;
    }

    #app-right {
      height: 100vh;
    }
  }

  #custom-background {
    z-index: -1;
    position: fixed;
    top: 0;
    left: 0;
    min-height: 100%;
    height: auto;
    width: 100%;
    min-width: 1024px;
    background-position: top center;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url('~/assets/img/app-background.jpg');
  }
}
</style>
