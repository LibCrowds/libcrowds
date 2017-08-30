<template>
  <b-navbar
    id="app-navbar"
    type="light"
    :sticky="sticky"
    :fixed="fixed">

    <span id="app-navbar-left">
      <b-link
        :class="`navbar-brand hidden-${hideBrandBreakpoint}-up`"
        :to="{
          name: 'landing'
        }">
        <span>{{ siteConfig.brand }}</span>
      </b-link>
    </span>

    <span id="app-navbar-right">
      <b-nav is-nav-bar v-if="currentUser" right>
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
            }"
            @click.native="toggleCollapsibleSidebar">Profile
          </b-dropdown-item>
          <b-dropdown-item
            :to="{
              name: 'account-settings',
              params: {
                username: currentUser.name
              }
            }"
            @click.native="toggleCollapsibleSidebar">Settings
          </b-dropdown-item>

          <!-- Admin -->
          <span>
            <div role="separator" class="dropdown-divider"></div>
            <b-dropdown-item
              :to="{
                name: 'admin-dashboard'
              }"
              v-if="currentUser.admin"
              @click.native="toggleCollapsibleSidebar">
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
            name: 'signin'
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
import pybossaApi from '@/api/pybossa'
import siteConfig from '@/siteConfig'

export default {
  data: function () {
    return {
      siteConfig: siteConfig,
      currentUser: this.$store.state.currentUser
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
    }
  },

  methods: {
     /**
     * Sign the user out.
     */
    signout () {
      pybossaApi.get('/account/signout')
      this.currentUser = this.$store.state.currentUser
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

  #app-navbar-left {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    border-bottom: 1px solid $gray-lighter;
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
    border-bottom: 1px solid $gray-lighter;
    height: 100%;
  }

  #sign-in-up {
    display: flex;
    flex-direction: row;
    font-size: $font-size-sm;
    font-weight: 600;
  }

  #btn-register {
    background-color: $brand-success;
    font-weight: 400;
    border-bottom: 1px solid $brand-success;

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
