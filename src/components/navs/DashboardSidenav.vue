<template>
  <div id="dashboard-sidenav">
    <nav :class="navClass">
      <div class="brand-wrapper text-center">
        <router-link
          class="brand"
          :to="{
            name: 'landing'
          }">
          {{ siteConfig.brand }}
        </router-link>
      </div>
        <ul class="nav list-group">
          <router-link
            tag="li"
            class="list-group-item"
            :to="item.link"
            v-for="item in navItems"
            :key="item.id">
            <a>
              {{ item.label }}
            </a>
          </router-link>
        </ul>
    </nav>
  </div>
</template>

<script>
import siteConfig from '@/siteConfig'

export default {
  data: function () {
    return {
      siteConfig: siteConfig,
      activeItem: null,
      navClass: {
        side: this.position === 'side',
        top: this.position === 'top'
      }
    }
  },

  props: {
    navItems: {
      type: Array,
      required: true
    },
    position: {
      type: String,
      default: 'top',
      validator: value => {
        const validPositions = [
          'top',
          'side'
        ]
        return validPositions.indexOf(value) > -1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/main';

#dashboard-sidenav {
  nav {
    overflow: auto;
    white-space: nowrap;
    z-index: 1;
    background:
      linear-gradient(rgba($gray-900, 0.8),
      rgba($gray-900, 0.8)),
      url('../../assets/img/app-background.jpg');
    background-size: cover;
    background-position: center center;
    display: none;
    font-size: 0.75rem;
    text-transform: uppercase;

    &.side {
      max-height: 100%;
      height: 100%;
      flex-direction: column;
      width: $sidebar-width;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;

      .brand-wrapper {
        display: flex;
      }

      .list-group-item {
        margin:
          calc(#{$list-group-item-padding-x} - #{$list-group-item-padding-y}) 0;
        font-weight: 400;
        letter-spacing: 0.8px;

        &:first-child {
          margin-top: 0;
        }
      }

      ul {
        display: block;
      }

      @include media-breakpoint-up(lg) {
        display: flex;

        & + .dashboard {
          z-index: 2;
          max-height: 100%;
          float: right;
          width: calc(100% - $sidebar-width);
        }
      }
    }

    &.top {
      .list-group-item {
        flex-direction: row;
        margin: 0 calc(#{$list-group-item-padding-x} - #{$list-group-item-padding-y});
      }

      ul {
        padding: 0.5rem 1rem;
        flex-direction: row;
      }

      @include media-breakpoint-down(md) {
        display: flex;
      }
    }

    .list-group-item {
      border: none;
      background-color: transparent;
      padding: 0rem;

      a {
        padding: $list-group-item-padding-x $list-group-item-padding-y;
        width: 100%;
        color: $white;
        display: block;
      }

      &:hover,
      &:focus,
      &.router-link-exact-active {
        background-color: rgba($blue, 0.25);

        a {
          text-decoration: none;
        }
      }

      &.router-link-exact-active {
        background-color: rgba($blue, 0.45);
      }
    }

    .brand-wrapper {
      @extend .navbar-light;
      display: none;
      height: $app-navbar-height;
      background: transparent;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid rgba($gray-300, 0.5);
      min-height: $app-navbar-height;

      .brand {
        @extend .navbar-brand;
        margin: 0;
        color: $white;

        @include hover-focus {
          color: $white;
        }
      }
    }
  }
}
</style>
