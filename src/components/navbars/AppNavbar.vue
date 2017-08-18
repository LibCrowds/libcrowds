<template>
  <b-navbar
    id="app-navbar"
    type="light"
    fixed="top">

    <b-link class="navbar-brand"
      :to="{
        name: 'landing'
      }">
      <span>{{ siteConfig.brand }}</span>
    </b-link>

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
            @click="showModal(openProjectModalId)">
            Open Project
          </b-dropdown-item>
          <b-dropdown-item
            to="#"
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
  </b-navbar>
</template>

<script>
import siteConfig from '@/settings/siteConfig'

export default {
  data: function () {
    return {
      siteConfig: siteConfig
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
  border-bottom: 1px solid $gray-lighter;

  .navbar-brand {
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0 1rem;
    letter-spacing: 1.15px;
    font-family: $font-family-base;
    font-weight: 600;
    text-transform: uppercase;
  }

  .nav {
    display: flex;
    flex-direction: row;
    align-self: center;
  }

  #sign-in-up {
    display: flex;
    flex-direction: row;
    font-size: $font-size-sm;
    font-weight: 600;
  }

  #btn-register {
    display: flex;
    align-self: center;
    flex-direction: row;
    background-color: $brand-success;
    padding: 0rem 0.75rem;
    font-weight: 400;

    a {
      color: $white;
    }
  }
}
</style>
