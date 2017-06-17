<template>
  <div class="app-navbar">
    <b-navbar toggleable type="inverse" sticky="top">
      <div class="container">
        <b-nav-toggle target="main-nav-collapse"></b-nav-toggle>

        <b-link class="navbar-brand" :to="{ name: 'landing' }">
          <span>{{ config.brand }}</span>
        </b-link>

        <b-collapse is-nav id="main-nav-collapse">

          <b-nav is-nav-bar>
            <b-nav-item :to="{ name: 'about' }">
              About
            </b-nav-item>
            <b-nav-item :to="{ name: 'projects' }">
              Projects
            </b-nav-item>
            <b-nav-item :to="{ name: 'results' }">
              Results
            </b-nav-item>
            <b-nav-item :to="{ name: 'data' }">
              Data
            </b-nav-item>
          </b-nav>

          <b-nav is-nav-bar>

            <b-nav-item-dropdown
              right
              v-if="currentUser"
              :text="currentUser.name">
              <b-dropdown-item to="#">Profile</b-dropdown-item>
              <b-dropdown-item to="#">Settings</b-dropdown-item>
              <div role="separator" class="dropdown-divider"></div>
              <b-dropdown-item to="#">Open Project</b-dropdown-item>
              <b-dropdown-item to="#">Admin</b-dropdown-item>
              <div role="separator" class="dropdown-divider"></div>
              <b-dropdown-item v-on:click="signout">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown>

            <b-nav-item @click="$root.$emit('show::modal','signin-modal')">
              Sign in
            </b-nav-item>
          </b-nav>
        </b-collapse>
      </div>
    </b-navbar>

    <signin-modal name="signin-modal"></signin-modal>

  </div>
</template>

<script>
import throttle from 'lodash/throttle'
import config from '@/config'
import pybossaApi from '@/api/pybossa'
import store from '@/store'
import SigninModal from '@/components/modals/Signin'

export default {
  name: 'app-navbar',
  data: function () {
    return {
      config: config,
      currentPath: this.$store.state.route.path
    }
  },

  components: {
    SigninModal
  },

  computed: {
    currentUser: () => store.state.currentUser
  },

  methods: {
    signout () {
      pybossaApi.get('/account/signout').then(r => {
        this.$store.dispatch('UPDATE_CURRENT_USER')
      })
    },
    styleNavbar: throttle(
      function () {
        let ieScrollTop = document.documentElement.scrollTop
        let scrollTop = document.body.scrollTop === 0
                          ? ieScrollTop
                          : document.body.scrollTop

        let bounds = []
        let nodes = document.getElementsByClassName('invert-navbar')
        for (let node of nodes) {
          bounds.push({
            top: node.offsetTop,
            bottom: node.offsetTop + node.offsetHeight
          })
        }

        for (let b of bounds) {
          if (scrollTop >= b.top - 25 && scrollTop <= b.bottom) {
            document.querySelector('.navbar').classList.add('navbar-light')
            document.querySelector('.navbar').classList.remove('navbar-inverse')
            return
          }
        }
        document.querySelector('.navbar').classList.remove('navbar-light')
        document.querySelector('.navbar').classList.add('navbar-inverse')
      },
      10
    )
  },

  created () {
    window.addEventListener('scroll', this.styleNavbar)
  },

  destroyed () {
    window.removeEventListener('scroll', this.styleNavbar)
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

.navbar {
  font-weight: 400;
  letter-spacing: 0.8px;
  justify-content: center;
  align-items: baseline;
  transition: background-color 200ms;

  .navbar-brand {
    font-family: $headings-font-family;
    font-size: $font-size-h3;
    font-weight: 300;
    transition: color 200ms;
  }

  .hamburger {
    display: none;
    padding: 0;
  }

  .navbar-toggler {
    border: none;
  }

  .navbar-nav {
    &:first-child {
      margin-right: auto;
    }

    .nav-item {
      font-size: $font-size-sm;
      margin-left: calc(2 * #{$nav-item-inline-spacer});
      margin-right: 0;
      position: relative;

      &:not(.dropdown) .nav-link:after {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 2px;
        content: '';
        background-color: $brand-primary;
        opacity: 0;
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

      .dropdown-menu {
        background-color: rgba($black, 0.75);
        font-size: $font-size-sm;
        right: 0;

        .dropdown-divider {
          width: 100%;
          margin: 0.75em 0;
          background-color: rgba($white, 0.5);
        }

        .dropdown-item {
          color: $white;

          @include hover-focus {
            color: $link-hover-color;
          }
        }
      }
    }
  }

  .dropdown-item:focus,
  .dropdown-item:hover,
  .dropdown-item.active,
  .nav-item .nav-link:focus,
  .nav-item .nav-link:hover,
  .nav-item .nav-link.active {
    color: $brand-primary !important;
    background-color: transparent;
  }

  .hamburger {
    z-index: 20;

  	&.hamburger--arrow {
  	  transform: rotate(180deg);
  	}
  }

  &.navbar-transparent {
    @extend .navbar-inverse;
    background-color: transparent;

    .hamburger-inner,
    .hamburger-inner:before,
    .hamburger-inner:after {
      background-color: $white;
    }
  }

  &.navbar-light {
    background: $white;
    border-bottom: 1px solid $gray-lighter;
  }

  &.navbar-dashboard {
    @extend .navbar-light;
    .navbar-brand {

      @include media-breakpoint-up(lg) {
        visibility: hidden;
      }
    }
  }
}

.navbar-toggleable {
  @each $breakpoint in map-keys($grid-breakpoints) {
    $next: breakpoint-next($breakpoint, $grid-breakpoints);
    $infix: breakpoint-infix($breakpoint, $grid-breakpoints);

    &#{$infix} {
      @include media-breakpoint-down($breakpoint) {
        display: flex;
        flex-direction: row;
        padding-left: $spacer-x;
        padding-right: $spacer-x;

        .hamburger {
          display: flex;
        }

        .navbar-collapse {
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
          width: 260px;
          position: fixed;
          z-index: 10;
          top: 0;
          left: 0;
          background-color: $brand-inverse;
          overflow-x: hidden;
          overflow-y: auto;
          text-align: center;
          transition: transform 450ms !important;

          &:not(.show) {
            transform: translateX(-100%);
            transition: transform 450ms !important;
          }

          .navbar-nav {
            margin-right: 0;
            display: block;

            .nav-item {
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
                color: $brand-primary;
              }
            }

            .dropdown-toggle,
            .dropdown-divider {
              display: none;
            }

            .dropdown-menu {
              display: block;
              background: transparent;
              text-align: center;
              padding: 0;
              margin: 0;
            }
          }
        }
      }
    }
  }
}
</style>
