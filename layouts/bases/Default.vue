<template>
  <div  id="default-layout-base" :class="mainClassObj">

    <div id="custom-background" :style="customBgStyle"></div>

    <side-navbar
      v-model="showSideNav"
      fixed
      :dark="darkMode || forceDarkMode"
      @close="showSideNav = false"
      @itemclick="onItemClick">
    </side-navbar>

    <div id="app-right">

      <top-navbar
        :dark="darkMode || forceDarkMode"
        :transparent="transparent"
        :fixed-top="fixedTop"
        :navbar-brand="navbarBrand"
        :class="navbarClass"
        @menuclick="showSideNav = !showSideNav">
      </top-navbar>

      <main :class="containerClass">
        <slot></slot>
      </main>

      <app-footer
        v-if="!hideFooter"
        :collections="publishedCollections">
      </app-footer>

      <div :class="backdropClassObj" @click="showSideNav = false"></div>

    </div>
  </div>
</template>

<script>
import 'vue-awesome/icons/question-circle'
import AppFooter from '@/components/footers/App'
import DashboardFooter from '@/components/footers/Dashboard'
import TopNavbar from '@/components/navbars/Top'
import SideNavbar from '@/components/navbars/Side'

export default {
  data () {
    return {
      showSideNav: false
    }
  },

  components: {
    TopNavbar,
    AppFooter,
    DashboardFooter,
    SideNavbar
  },

  props: {
    showHelp: {
      type: Boolean,
      default: false
    },
    hideFooter: {
      type: Boolean,
      default: false
    },
    navbarClass: {
      type: String,
      required: false
    },
    contained: {
      type: Boolean,
      default: false
    },
    navbarBrand: {
      type: String,
      required: false
    },
    backgroundImageUrl: {
      type: String,
      required: false
    },
    fixedTop: {
      type: Boolean,
      default: false
    },
    transparent: {
      type: Boolean,
      default: false
    },
    forceDarkMode: {
      type: Boolean,
      default: false
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

    customBgStyle () {
      if (
        typeof this.backgroundImageUrl !== 'undefined' &&
        this.backgroundImageUrl.length
      ) {
        return {
          backgroundImage: `url(${this.backgroundImageUrl})`
        }
      }
    },

    mainClassObj () {
      const bgImgUrl = this.backgroundImageUrl
      return {
        'dark-mode': this.darkMode || this.forceDarkMode,
        'bg-default': !bgImgUrl && !(this.darkMode || this.forceDarkMode),
        'bg-default-dark': !bgImgUrl && (this.darkMode || this.forceDarkMode)
      }
    }
  },

  methods: {
    /**
     * Handle sidebar click, collapsing if not navigating to a dashboard page.
     * @param {Object} route
     *   The route being navigated to.
     */
    onItemClick (route) {
      if (
        !route.name.startsWith('admin-') &&
        !route.name.startsWith('account-name-templates-')
      ) {
        this.showSideNav = false
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

  &.bg-default {
    background-image: url('~/assets/img/geometry.png');
  }

  &.bg-default-dark {
    background-image: url('~/assets/img/geometry-dark.png');
  }

  main {
    flex: 1 1 auto;
  }

  .modal-backdrop {
    background-color: rgba($black, 0.35);
  }

  #app-right {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: auto;
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
  }

  &.dark-mode {
    #custom-background {
      filter: brightness(0.75);
    }
  }
}
</style>
