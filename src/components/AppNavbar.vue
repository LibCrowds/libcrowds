<template>
  <div class="app-navbar">
    <b-navbar toggleable type="inverse" sticky="top">

      <b-nav-toggle target="main-nav-collapse"></b-nav-toggle>

      <b-link class="navbar-brand" :to="{ name: 'home', params: { sitename: sitename }}">
        <span>{{ pbConfig.title }}</span>
      </b-link>

      <b-collapse is-nav id="main-nav-collapse">

        <b-nav is-nav-bar>
          <b-nav-item :to="{ name: 'about', params: { sitename: sitename }}">About</b-nav-item>
          <b-nav-item :to="{ name: 'projects', params: { sitename: sitename }}">Projects</b-nav-item>
          <b-nav-item :to="{ name: 'stats', params: { sitename: sitename }}">Statistics</b-nav-item>
          <b-nav-item :to="{ name: 'results', params: { sitename: sitename }}">Results</b-nav-item>
          <b-nav-item :to="{ name: 'data', params: { sitename: sitename }}">Data</b-nav-item>
        </b-nav>

        <b-nav is-nav-bar>
          <b-nav-item-dropdown text="current user" right>
            <b-dropdown-item to="#">Profile</b-dropdown-item>
            <b-dropdown-item to="#">Settings</b-dropdown-item>
            <div role="separator" class="dropdown-divider"></div>
            <b-dropdown-item to="#">New Project</b-dropdown-item>
            <b-dropdown-item to="#">Open Project</b-dropdown-item>
            <b-dropdown-item to="#">Admin</b-dropdown-item>
            <div role="separator" class="dropdown-divider"></div>
            <b-dropdown-item to="#">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>

        </b-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import config from '@/config'

export default {
  name: 'app-navbar',
  data: function () {
    return {
      config: config,
      sitename: this.$store.state.route.params.sitename,
      pbConfig: config.pybossaSites[ this.$store.state.route.params.sitename ]
    }
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

.navbar {
  width: 90%;
  margin-right: auto;
  margin-left: auto;
  padding-left: 0 !important;
  padding-right: 0 !important;
  font-weight: 400;
  letter-spacing: 0.8px;
  justify-content: center;
  align-items: baseline;

  .navbar-brand {
    font-family: $headings-font-family;
    font-size: $font-size-h3;
    font-weight: 300;
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

      &.active .nav-link:after,
      .nav-link:hover:after,
      .nav-link:focus:after {
        opacity: 1;
        transform: none;
      }

      .nav-link {
        transition: color 200ms;
        padding: .35rem 0;

        &:not(.dropdown-toggle) {
          &:after {
            transition: opacity 200ms, transform 200ms;
            transform: translateY(10px);
          }

          @include hover-focus {
            &:after {
              transform: none;
            }
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

      &.active {
        .nav-link:after {
          transform: none;
        }
      }
    }
  }

  .dropdown-item:focus,
  .dropdown-item:hover,
  .dropdown-item.active,
  .nav-item .nav-link:focus,
  .nav-item .nav-link:hover,
  .nav-item.active .nav-link {
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

          &:not(.show) {
            transform: translateX(-100%);
            transition: transform 450ms !important;
          }

          .navbar-nav {
            margin-right: 0;
            display: block;

            .nav-item {
              margin-left: 0;

              &.active .nav-link:after,
              .nav-link:hover:after,
              .nav-link:focus:after {
                opacity: 0;
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
