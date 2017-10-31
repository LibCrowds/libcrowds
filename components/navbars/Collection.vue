<template>
  <b-navbar
    id="collection-navbar"
    toggleable
    toggle-breakpoint="md"
    :type="type"
    :fixed="navType.fixed">
    <div class="container">

      <b-link class="navbar-brand"
        :to="{
          name: 'collection-short_name',
          params: {
            short_name: collection.short_name
          }
        }"
        v-scroll-to="'body'">
        <span>{{ collection.name }}</span>
      </b-link>

      <button
        @click="toggleCollapsibleSidebar"
        ref="hamburger"
        class="
          hamburger
          hamburger--collapse
          navbar-toggler
          navbar-toggler-right"
        type="button"
        data-toggle="collapse"
        data-target="#main-nav-collapse"
        aria-controls="main-nav-collapse"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="hamburger-box">
          <span class="hamburger-inner"></span>
        </span>
      </button>

      <b-collapse is-nav id="main-nav-collapse" ref="sidebar">

        <!-- Main menu -->
        <b-nav is-nav-bar>
          <b-nav-item
            :to="{
              name: 'collection-short_name-about',
              params: {
                short_name: collection.short_name
              }
            }"
            @click.native="toggleCollapsibleSidebar">
            About
          </b-nav-item>
          <b-nav-item
            :to="{
              name: 'collection-short_name-projects',
              params: {
                short_name: collection.short_name
              }
            }"
            @click.native="toggleCollapsibleSidebar">
            Contribute
          </b-nav-item>
          <b-nav-item
            :href="collection.info.forum"
            v-if="collection.info.forum">
            Discuss
          </b-nav-item>
          <!-- <b-nav-item
            :to="{
              name: 'collection-short_name-results',
              params: {
                short_name: collection.short_name
              }
            }"
            @click.native="toggleCollapsibleSidebar">
            Results
          </b-nav-item> -->
          <b-nav-item
            :to="{
              name: 'collection-short_name-data',
              params: {
                short_name: collection.short_name
              }
            }"
            @click.native="toggleCollapsibleSidebar">
            Data
          </b-nav-item>
        </b-nav>

        <b-nav is-nav-bar v-if="loggedIn">

          <announcements></announcements>

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
              }"
              @click.native="toggleCollapsibleSidebar">Profile
            </b-dropdown-item>
            <b-dropdown-item
              :to="{
                name: 'account-name-settings-profile',
                params: {
                  name: currentUser.name
                }
              }"
              @click.native="toggleCollapsibleSidebar">Settings
            </b-dropdown-item>

            <!-- Project management -->
            <span v-if="currentUser.admin">
              <div role="separator" class="dropdown-divider"></div>
              <b-dropdown-item
                :to="{
                  name: 'project-open',
                  params: {
                    name: currentUser.name
                  }
                }">
                Projects Admin
              </b-dropdown-item>
              <b-dropdown-item
                :to="{
                  name: 'admin-dashboard'
                }"
                @click.native="toggleCollapsibleSidebar">
                Site Admin
              </b-dropdown-item>
            </span>

            <div role="separator" class="dropdown-divider"></div>
            <b-dropdown-item v-on:click="signout">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-nav>

        <!-- Sign in/sign up -->
        <b-nav is-nav-bar v-else>
          <b-nav is-nav-bar>
            <b-nav-item
              :to="{
                name: 'account-signin',
                query: {
                  next: $route.path
                }
              }">
              Sign in
            </b-nav-item>
            <b-nav-item
              class="nav-button"
              :to="{
                name: 'account-register'
              }">
              Sign up
            </b-nav-item>
          </b-nav>

        </b-nav>
      </b-collapse>
    </div>
  </b-navbar>
</template>

<script>
import { notifications } from '@/mixins/notifications'
import isEmpty from 'lodash/isEmpty'
import throttle from 'lodash/throttle'
import Announcements from '@/components/lists/Announcements'

export default {
  data () {
    return {
      currentPath: this.$route.path,
      fixedNavbarRoutes: [
        'collection-short_name'
      ]
    }
  },

  props: {
    collection: {
      type: Object,
      required: true
    },
    currentUser: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      default: 'dark'
    },
    invertable: {
      type: Boolean,
      default: true
    }
  },

  components: {
    Announcements
  },

  computed: {
    navType () {
      if (this.fixedNavbarRoutes.indexOf(this.$route.name) > -1) {
        return {
          fixed: 'top'
        }
      }
      return {
        fixed: null
      }
    },
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
    },

    /**
     * Style the navbar, switching colors if over an invert-navbar element.
     */
    styleNavbar: throttle(
      function () {
        if (!this.invertable) {
          return
        }

        let ieScrollTop = document.documentElement.scrollTop
        let scrollTop = document.body.scrollTop === 0
          ? ieScrollTop
          : document.body.scrollTop

        let bounds = []
        let nodes = document.getElementsByClassName('invert-navbar')
        for (let i = 0; i < nodes.length; i++) {
          bounds.push({
            top: nodes[i].offsetTop,
            bottom: nodes[i].offsetTop + nodes[i].offsetHeight
          })
        }

        for (let b of bounds) {
          if (scrollTop >= b.top - 25 && scrollTop <= b.bottom) {
            document.querySelector('.navbar').classList.add('navbar-light')
            document.querySelector('.navbar').classList.remove('navbar-dark')
            return
          }
        }
        document.querySelector('.navbar').classList.remove('navbar-light')
        document.querySelector('.navbar').classList.add('navbar-dark')
      },
      10
    ),

    /**
     * Style the hamburger so that it always turns white over the sidebar.
     */
    styleHamburger () {
      const hamburger = this.$refs.hamburger
      const isActive = hamburger.classList.contains('is-active')
      const colorTimeout = isActive ? 50 : 300
      setTimeout(function () {
        hamburger.classList.toggle('white')
      }, colorTimeout)
    },

    /**
     * Handle window scroll.
     */
    onWindowScroll () {
      this.styleNavbar()
    },

    /**
     * Toggle the collapsible sidebar.
     */
    toggleCollapsibleSidebar () {
      if (process.browser && window.innerWidth < 992) {
        const hamburger = this.$refs.hamburger
        const sidebar = this.$refs.sidebar

        this.styleHamburger()
        hamburger.blur()

        sidebar.$el.classList.toggle('show')
        hamburger.classList.toggle('is-active')

        // Restrict body and scroll to top after collapse if new location
        if (sidebar.$el.classList.contains('show')) {
          setTimeout(() => {
            this.restrictBody(true)
          }, 450)
        } else {
          this.restrictBody(false)
        }

        this.currentPath = window.location.pathname
        this.styleNavbar()
      }
    },

    /**
     * Show a modal and toggle the sidebar.
     * @param {String} name
     *   The modal name.
     */
    showModal (name) {
      this.toggleCollapsibleSidebar()
      this.$root.$emit('show::modal', name)
    },

    /**
     * Restrict body content to avoid scroll bar while sidebar is open.
     */
    restrictBody (restrict = true) {
      if (restrict) {
        document.querySelector('body').style.height = '100vh'
        document.querySelector('body').style.overflow = 'hidden'
      } else {
        document.querySelector('body').style.height = '100%'
        document.querySelector('body').style.overflow = 'initial'
      }
    },

    /**
     * Handle window resize
     */
    onWindowResize () {
      const sidebar = this.$refs.sidebar
      if (window.innerWidth >= 992) {
        this.restrictBody(false)
      } else if (sidebar.$el.classList.contains('show')) {
        this.restrictBody(true)
      }
    }
  },

  mixins: [ notifications ],

  mounted () {
    window.addEventListener('scroll', this.onWindowScroll)
    window.addEventListener('resize', this.onWindowResize)
  },

  destroyed () {
    window.removeEventListener('scroll', this.onWindowScroll)
    window.removeEventListener('resize', this.onWindowResize)
  }
}
</script>

<style lang="scss">
@import '~assets/style/settings';
@import '~hamburgers/_sass/hamburgers/hamburgers';

#collection-navbar {
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: $collection-navbar-height;
  font-family: $font-family-base;
  font-weight: 500;
  letter-spacing: 0.8px;
  justify-content: center;
  transition: background-color 200ms;

  .container {
    margin: 0;

    @include media-breakpoint-down(xs) {
      margin: 0;
      flex: 1 1 auto;
    }
  }

  .navbar-brand {
    font-family: $headings-font-family;
    font-weight: 300;
    transition: color 200ms;
    margin-right: 1rem;

    @include media-breakpoint-up(sm) {
      font-size: $h3-font-size;
    }
  }

  .hamburger {
    display: none;
    right: 0;  // Otherwise it floats left
  }

  .navbar-toggler {
    border: none;
    align-self: center;

    &.white {
      .hamburger-inner,
      .hamburger-inner:before,
      .hamburger-inner:after {
        background-color: $white;
      }
    }
  }

  .navbar-nav {
    &:first-child {
      margin-right: auto;
    }

    .nav-item {
      font-size: $font-size-sm;
      margin-left: 2rem;
      margin-right: 0;
      position: relative;

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

      &.nav-button {
        padding: 0 0.5rem;
        transition: background-color 250ms;
        margin-left: 1rem;

        .nav-link {
          transition: color 250ms;

          &:after {
            content: none;
          }

          &:focus,
          &:hover,
          &.active {
            color: $red;
          }
        }

        @include media-breakpoint-up(lg) {
          border: 1px solid $white;
          border-radius: 2.5rem;
        }
      }

      .nav-link {
        transition: color 200ms;
        padding: .35rem 0;

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
    }

    .dropdown-menu {
      font-size: $font-size-sm;
      right: 0;

      .dropdown-divider {
        width: 100%;
        margin: 0.75em 0;
      }

      .dropdown-item {
        @include hover-focus {
          color: $link-hover-color;
        }
      }
    }
  }

  .dropdown-item:focus,
  .dropdown-item:hover,
  .dropdown-item.active,
  .nav-item:not(.nav-button) .nav-link:focus,
  .nav-item:not(.nav-button) .nav-link:hover,
  .nav-item:not(.nav-button) .nav-link.active {
    color: $red !important;
    background-color: transparent;
  }

  .hamburger {
    z-index: 20;
    padding: 0;
    display: flex;
    flex-direction:column;
    height: 100%;

    @include media-breakpoint-up(lg) {
      display: none;
    }
  }

  &.navbar-dark {
    background-color: transparent;

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

    .hamburger-inner,
    .hamburger-inner:before,
    .hamburger-inner:after {
      background-color: $white;
    }
  }

  &.navbar-light {
    background: $white;
    border-bottom: 1px solid $gray-300;

    .nav-item.nav-button {
      transition: border-color 400ms;
      border-color: $gray-600;
    }
  }

  // Collapsible sidebar
  @include media-breakpoint-down(md) {
    .navbar-collapse {
      display: flex !important;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      width: 100%;
      position: fixed;
      z-index: 10;
      top: 0;
      left: 0;
      background-color: $gray-1100;
      overflow-x: hidden;
      overflow-y: auto;
      text-align: center;
      transition: all 450ms !important;
      transform: translateX(-100%);

      &.show {
        transform: translateX(0);
      }

      .navbar-nav {
        margin-right: 0;
        display: block;

        .nav-item {
          color: inherit;
          margin-left: 0;

          .nav-link.active:after,
          .nav-link:hover:after,
          .nav-link:focus:after {
            opacity: 0;
            transform: none;
          }
        }

        .nav-link,
        .dropdown-item {
          padding: $list-group-item-padding-y;
          color: $white;

          @include hover-focus {
            color: $red;
          }
        }

        .dropdown-toggle,
        .dropdown-divider {
          display: none;
        }

        .dropdown-menu {
          position: relative;
          display: block;
          background: transparent;
          text-align: center;
          padding: 0;
          margin-left: auto;
          margin-left: auto;
          min-width: auto;
          border: none;

          .dropdown-item {
            @include hover-focus {
              outline: 0;
              background: transparent;
            }
          }
        }
      }
    }
  }
}
</style>
