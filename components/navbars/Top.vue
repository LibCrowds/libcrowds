<template>
  <b-navbar
    id="top-navbar"
    :variant="navbarVariant"
    :type="navbarType"
    :fixed="fixedTop ? 'top': null">

    <b-btn
      variant="outline-dark"
      class="px-2 border-top-0 border-left-0"
      @click="$emit('menuclick')">
      <icon name="bars" class="mr-1"></icon>
      <p class="mb-0">Menu</p>
    </b-btn>

    <span class="top-navbar-left">
      <b-link
        v-if="navbarBrand"
        class="navbar-brand d-none d-lg-block ml-1 mr-2"
        @click="onNavbarBrandClick">
        <span>{{ navbarBrand }}</span>
      </b-link>

      <!-- Main menu -->
      <b-navbar-nav class="main-nav-menu d-none d-xl-flex">
        <b-nav-item
          v-for="(item, index) in currentMicrositeNavItems"
          :key="index"
          exact
          :to="item.external ? '' : item.link"
          :href="item.external ? item.link : ''"
          @click="$emit('itemclick', item.link)">
          {{ item.label }}
        </b-nav-item>
      </b-navbar-nav>
    </span>

    <b-navbar-nav right class="top-navbar-right" v-if="loggedIn">

      <slot name="right"></slot>

      <!-- Docs -->
      <b-navbar-nav
        v-if="showHelp && localConfig.docs">
        <b-nav-item
          class="px-1"
          :href="localConfig.docs"
          target="_blank">
          <span class="d-none d-md-block">Go to docs</span>
          <icon
            name="question-circle"
            class="d-md-none"
            scale="1.2">
          </icon>
        </b-nav-item>
      </b-navbar-nav>

      <!-- Announcements -->
      <announcements></announcements>

      <!-- User menu -->
      <b-nav-item-dropdown
        right
        no-caret
        id="user-menu"
        class="pr-2 pl-1">
        <div
          class="d-flex flex-row align-items-center"
          slot="button-content">
          <small-avatar
            extra-small
            class="mr-1"
            :gravatar="currentUser.name"
            :info="currentUser.info">
          </small-avatar>
          <span class="d-none d-md-block mr-1">{{ currentUser.name }}</span>
          <icon name="caret-down"></icon>
        </div>

        <!-- Profile/settings -->
        <b-dropdown-item
          :to="{
            name: 'account-name',
            params: {
              name: currentUser.name
            }
          }">Profile
        </b-dropdown-item>
        <b-dropdown-item
          :to="{
            name: 'account-name-settings-profile',
            params: {
              name: currentUser.name
            }
          }">Settings
        </b-dropdown-item>

        <div role="separator" class="dropdown-divider"></div>
        <b-dropdown-item v-on:click="signout">Sign Out</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>

    <!-- Sign in/sign up -->
    <b-navbar-nav right class="top-navbar-right" v-else>
     <li class="navbar-nav top-navbar-right">     
      <b-btn
        variant="outline-dark"
        class="px-2 border-0"
        :to="{
          name: 'account-signin',
          query: {
            next: $route.path
          }
        }">
        <p class="mb-0">Sign in</p>
      </b-btn>
     </li>
     <li class="navbar-nav top-navbar-right"> 
      <b-btn
        :variant="navbarVariant === 'transparent' ? 'outline-dark' : 'success'"
        class="px-2 border-0"
        :to="{
          name: 'account-register'
        }">
        <p class="mb-0">Sign up</p>
      </b-btn>
      </li>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
import 'vue-awesome/icons/question-circle'
import 'vue-awesome/icons/bars'
import 'vue-awesome/icons/caret-down'
import throttle from 'lodash/throttle'
import isEmpty from 'lodash/isEmpty'
import { currentMicrositeNavItems } from '@/mixins/currentMicrositeNavItems'
import SmallAvatar from '@/components/avatars/Small'
import localConfig from '@/local.config'
import Announcements from '@/components/lists/Announcements'

export default {
  mixins: [ currentMicrositeNavItems ],

  data () {
    return {
      localConfig: localConfig,
      navbarVariant: this.transparent ? 'transparent' : null
    }
  },

  props: {
    fixedTop: {
      type: Boolean,
      default: false
    },
    navbarBrand: {
      type: String,
      required: false
    },
    transparent: {
      type: Boolean,
      default: false
    },
    showHelp: {
      type: Boolean,
      default: false
    },
    dark: {
      type: Boolean,
      default: false
    }
  },

  components: {
    Announcements,
    SmallAvatar
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },

    loggedIn () {
      return !isEmpty(this.currentUser)
    },

    navbarType () {
      return this.dark ? 'dark' : 'light'
    }
  },

  methods: {
    /**
     * Sign the user out.
     */
    signout () {
      this.$store.dispatch('LOGOUT', this.$axios, this.$flarum)
    },

    /**
     * Handle click of the navbar brand.
     */
    onNavbarBrandClick () {
      const micrositeShortName = this.$route.path.indexOf('/collection') === 0
        ? this.$route.path.replace(/^(\/collection\/)/, '').split('/')[0]
        : null
      let link = {
        name: 'index'
      }
      if (micrositeShortName) {
        link = {
          name: 'collection-short_name',
          params: {
            short_name: micrositeShortName
          }
        }
      }
      this.$router.push(link)
      this.$emit('itemclick', link)
    },

    /**
     * Remove navbar transparency.
     *
     * Applies if over an opaque-navbar element, or if on an extra-small screen.
     */
    styleNavbar: throttle(
      function () {
        const ieScrollTop = document.documentElement.scrollTop
        const scrollTop = document.body.scrollTop === 0
          ? ieScrollTop
          : document.body.scrollTop
        const bounds = []
        const nodes = document.getElementsByClassName('opaque-navbar')
        for (let i = 0; i < nodes.length; i++) {
          bounds.push({
            top: nodes[i].offsetTop,
            bottom: nodes[i].offsetTop + nodes[i].offsetHeight
          })
        }

        for (let b of bounds) {
          if (
            scrollTop >= b.top - 25 &&
            scrollTop <= b.bottom &&
            this.transparent
          ) {
            this.navbarVariant = null
            return
          }
        }

        if (window.innerWidth < 576) {
          this.navbarVariant = null
          return
        }

        if (this.transparent) {
          this.navbarVariant = 'transparent'
        }
      },
      10
    )
  },

  mounted () {
    this.styleNavbar()
    window.addEventListener('scroll', this.styleNavbar)
    window.addEventListener('resize', this.styleNavbar)
  },

  destroyed () {
    window.removeEventListener('scroll', this.styleNavbar)
    window.addEventListener('resize', this.styleNavbar)
  }
}
</script>

<style lang="scss">
#top-navbar {
  padding: 0;
  display: flex;
  flex-direction: row;
  align-self: center;
  justify-content: space-between;
  font-size: $font-size-sm;
  min-height: $top-navbar-height;
  height: $top-navbar-height;
  width: 100%;
  z-index: $zindex-fixed;
  transition: background-color 200ms;

  .btn-outline-dark {
    &:hover,
    &:focus,
    &.active {
      color: inherit;
      background-color: inherit;
    }
  }

  &.navbar-light {
    background-color: $white;

    .btn {
      border-color: $gray-300;
    }
  }

  &.navbar-dark {
    background-color: $gray-1000;

    .btn {
      border-right: 1px solid $gray-1000;
      border-bottom: 1px solid $gray-800;
    }

    .top-navbar-left,
    .top-navbar-right {
      border-bottom: 1px solid $gray-800;
    }
  }

  &.navbar-dark,
  &.bg-transparent {
    .dropdown-menu {
      background-color: rgba($black, 0.75);
      color: $white;

      .dropdown-divider {
        background-color: rgba($white, 0.35);
      }

      .dropdown-item {
        color: $white;
        background: transparent;
      }
    }

    .navbar-brand,
    .nav-link {
      color: $white;
    }

    .btn {
      cursor: pointer;
      color: $white;

      @include hover-focus {
        color: $white;
        background: transparent;
      }
    }
  }

  .btn {
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;
    font-size: $font-size-sm;
    font-weight: 600;
    text-transform: uppercase;
  }

  &.bg-transparent {
    background-color: transparent;

    .top-navbar-left,
    .top-navbar-right {
      border-color: transparent;
    }

    .btn {
      border-color: transparent;

      @include hover-focus {
        border-color: transparent;
      }
    }
  }

  .top-navbar-left,
  .top-navbar-right {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid $gray-300;
  }

  .top-navbar-left {
    flex: 1 1 auto;
    padding: 0 0.75rem;
  }

  .navbar-brand {
    margin: 0;
    letter-spacing: 1.15px;
    font-family: $font-family-base;
    font-weight: 600;
    text-transform: uppercase;
    display: none;

    @include media-breakpoint-up(sm) {
      display: block;
    }
  }

  .nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100%;
  }

  .nav-item {
    text-transform: none;
    font-weight: 500;

    svg {
      display: flex;
    }
  }

  #user-menu {
    font-weight: 600;
    text-transform: uppercase;
    padding: 0 0.75rem;
    color: inherit;
    display: inline-block;

    .nav-link {
      letter-spacing: 0.4px;
    }

    @include media-breakpoint-up(sm) {
      display: block;
      padding: 0 1.25rem;
    }

    &:not(.dropdown) {
      display: flex;
      justify-content: center;
      flex-direction: column;
      padding: 0rem 1.25rem;
      border-bottom: 1px solid $gray-300;
      height: 100%;
      white-space: nowrap;
    }
  }

  .main-nav-menu {
    display: flex;
    flex-direction: row;

    &:first-child {
      margin-right: auto;
    }

    .nav-item {
      font-size: $font-size-sm;
      margin-left: 1rem;
      margin-right: 1rem;
      border-bottom: none;
      position: relative;
      text-transform: none;
      padding: 0;

      &:not(.dropdown):not(.nav-button) .nav-link:after {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 2px;
        content: '';
        background-color: $red;
        opacity: 0;
      }

      .nav-link {
        font-weight: 500;
        letter-spacing: 0.8px;
        transition: color 250ms;
        padding: .25rem 0;
        transition: color 200ms;
        padding: .35rem 0;

        &:after {
          content: none;
        }

        &:focus,
        &:hover,
        &.active {
          color: $red;
        }

        &:not(.dropdown-toggle) {
          &:after {
            transition: opacity 200ms, transform 200ms;
            transform: translateY(10px);
          }

          &.active:after,
          &:hover:after,
          &:focus:after {
            opacity: 1;
            transform: none;
          }
        }
      }

      &.nav-button {
        padding: 0 0.5rem;
        transition: background-color 250ms;
        margin-left: 1rem;

        @include media-breakpoint-up(lg) {
          border: 1px solid $white;
          border-radius: 2.5rem;
        }
      }
    }
  }

  .dropdown-menu {
    position: absolute;
    border-radius: 0;
    right: 1rem;
    left: auto;
    text-transform: none;
  }

  .dropdown-item.active {
    color: initial;
    background-color: $white;
  }

  .dropdown-divider {
    margin: 0.5rem 0;
  }
}

</style>
<!-- Addition css for Contrast Errors fixes -->
<style> 
  #app-right { background: rgba(0, 0, 0, 0.01);}
  #collection-about a, #collection-data a, h6 a, #collection-projects a, #collection-browse a, .card-base a  {color: #03757a;}
  footer h5{color: #8C959D;}
  footer section p {color: #8C959D;}
  a.btn.btn-success, button.btn.btn-success {color: #fff!important  ;background:#307e30;}
  #app-right .jumbotron.code-bg { background: rgba(0, 0, 0, 0.01);}


  .btn-primary {
    color: #FFFFFF;
    background-color: #104967 !important;
    border-color: #104967 !important;
    }


   .btn-primary:hover {
      color: #FFFFFF;
      background-color: #104967 !important;
      border-color: #104967 !important;
    }
</style>