<template>
  <b-navbar
    id="app-navbar"
    type="light"
    :sticky="sticky"
    :fixed="fixed">

    <span class="app-navbar-left ml-1">
      <b-link
        :class="`navbar-brand d-${hideBrandBreakpoint}-none`"
        :to="{
          name: 'index'
        }">
        <span>{{ localConfig.brand }}</span>
      </b-link>
    </span>

    <span class="app-navbar-right border-bottom" v-if="loggedIn">
      <b-nav is-nav-bar right>

        <!-- Hide on small screens until the new menu is in place -->
        <announcements class="d-none d-lg-block"></announcements>

        <b-nav-item-dropdown
          right
          :text="currentUser.name">

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

          <!-- Project management -->
          <span v-if="currentUser.admin">
            <div role="separator" class="dropdown-divider"></div>
            <b-dropdown-item
              :to="{
                name: 'project-open'
              }">
              Project Admin
            </b-dropdown-item>
            <b-dropdown-item
              :to="{
                name: 'admin-dashboard'
              }">
              Site Admin
            </b-dropdown-item>
          </span>

          <div role="separator" class="dropdown-divider"></div>
          <b-dropdown-item v-on:click="signout">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-nav>

      <!-- Sign in/sign up -->
    </span>
    <span class="app-navbar-right" v-else>
      <b-nav id="sign-in-up" is-nav-bar right>
        <b-nav-item
          exact
          :to="{
            name: 'account-signin',
            query: {
              next: $route.path
            }
          }">
          Sign in
        </b-nav-item>
        <b-nav-item
          exact
          id="btn-register"
          :to="{
            name: 'account-register'
          }">
          Sign up
        </b-nav-item>
      </b-nav>
    </span>
  </b-navbar>
</template>

<script>
import { notifications } from '@/mixins/notifications'
import isEmpty from 'lodash/isEmpty'
import localConfig from '@/local.config'
import Announcements from '@/components/lists/Announcements'

export default {
  data () {
    return {
      localConfig: localConfig
    }
  },

  props: {
    fixed: {
      type: String,
      default: 'top'
    },
    sticky: {
      type: Boolean,
      default: false
    },
    hideBrandBreakpoint: {
      type: String,
      defualt: null
    },
    currentUser: {
      type: Object,
      required: true
    }
  },

  components: {
    Announcements
  },

  computed: {
    loggedIn () {
      return !isEmpty(this.currentUser)
    }
  },

  methods: {
    /**
    * Sign the user out.
    */
    signout () {
      return this.$axios.$get('/account/signout').then(data => {
        this.$store.dispatch('LOGOUT')
        this.$router.push({ name: 'index' })
        this.flash(data)
      })
    }
  },

  mixins: [ notifications ]
}
</script>

<style lang="scss">
@import '~assets/style/settings';

#app-navbar {
  background-color: $white;
  padding: 0;
  display: flex;
  flex-direction: row;
  align-self: center;
  justify-content: space-between;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  min-height: $app-navbar-height;
  height: $app-navbar-height;
  width: 100%;

  .app-navbar-left {
    height: 100%;
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    border-bottom: 1px solid $gray-300;
  }

  .app-navbar-right {
    height: 100%;

    &.border-bottom {
      border-bottom: 1px solid $gray-300;
    }
  }

  .navbar-brand {
    margin: 0;
    letter-spacing: 1.15px;
    font-family: $font-family-base;
    font-weight: 600;
    text-transform: uppercase;

    @include media-breakpoint-up(sm) {
      padding: 0 1.25rem;
    }
  }

  .nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100%;
  }

  .nav-item {
    padding: 0 0.75rem;
    color: inherit;

    @include media-breakpoint-up(sm) {
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

  #sign-in-up {
    height: 100%;
    display: flex;
    flex-direction: row;
    font-size: $font-size-sm;
    font-weight: 600;
  }

  #btn-register {
    background-color: $green;
    font-weight: 400;
    border-bottom: 1px solid $green;

    a {
      color: $white;
    }
  }

  .dropdown {
    padding: 0 1.75rem;
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
