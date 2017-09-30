<template>
  <b-navbar
    id="app-navbar"
    type="light"
    :sticky="sticky"
    :fixed="fixed">

    <span id="app-navbar-left">
      <b-link
        :class="`navbar-brand d-${hideBrandBreakpoint}-none`"
        :to="{
          name: 'landing'
        }">
        <span>{{ siteConfig.brand }}</span>
      </b-link>
    </span>

    <span id="app-navbar-right">
      <b-nav is-nav-bar v-if="loggedIn" right>
        <b-nav-item-dropdown
          right
          :text="currentUser.name">

          <!-- Profile/settings -->
          <b-dropdown-item
            :to="{
              name: 'profile',
              params: {
                username: currentUser.name
              }
            }">Profile
          </b-dropdown-item>
          <b-dropdown-item
            :to="{
              name: 'account-settings',
              params: {
                username: currentUser.name
              }
            }">Settings
          </b-dropdown-item>

          <!-- Project management -->
          <span v-if="currentUser.admin">
            <div role="separator" class="dropdown-divider"></div>
            <b-dropdown-item
              :to="{
                name: 'account-projects',
                params: {
                  username: currentUser.name
                }
              }">
              Open Project
            </b-dropdown-item>
          </span>

          <!-- Admin -->
          <span v-if="currentUser.admin">
            <div role="separator" class="dropdown-divider"></div>
            <b-dropdown-item
              :to="{
                name: 'admin-dashboard'
              }">
              Admin
            </b-dropdown-item>
          </span>

          <div role="separator" class="dropdown-divider"></div>
          <b-dropdown-item v-on:click="signout">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-nav>

      <!-- Sign in/sign up -->
      <b-nav id="sign-in-up" is-nav-bar v-else right>
        <b-nav-item
          :to="{
            name: 'signin',
            query: {
              next: next
            }
          }">
          Sign in
        </b-nav-item>
        <b-nav-item
          id="btn-register"
          :to="{
            name: 'register'
          }">
          Sign up
        </b-nav-item>
      </b-nav>
    </span>
  </b-navbar>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import siteConfig from '@/siteConfig'

export default {
  data: function () {
    return {
      siteConfig: siteConfig
    }
  },

  props: {
    currentUser: {
      type: Object,
      required: true
    },
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
    }
  },

  computed: {
    loggedIn: function () {
      return !isEmpty(this.currentUser)
    },
    next: function () {
      return this.$route.path
    }
  },

  methods: {
     /**
     * Sign the user out.
     */
    signout () {
      this.$store.dispatch('LOGOUT')
    }
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/main';

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
  min-height: $app-navbar-height;
  height: $app-navbar-height;

  #app-navbar-left {
    height: 100%;
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    border-bottom: 1px solid $gray-300;
  }

  #app-navbar-right {
    height: 100%;
  }

  .navbar-brand {
    margin: 0;
    padding: 0 1.75rem;
    letter-spacing: 1.15px;
    font-family: $font-family-base;
    font-weight: 600;
    text-transform: uppercase;
  }

  .nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100%;
  }

  .nav-item {
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 0rem 1.25rem;
    border-bottom: 1px solid $gray-300;
    height: 100%;
    white-space: nowrap;
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
    border-radius: 0;
    right: 1rem;
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
