<template>
  <div id="dashboard-layout">
    <div class="dashboard-menu side">
      <div class="brand-wrapper text-center">
        <router-link
          class="brand"
          :to="{
            name: 'landing'
          }">
          {{ siteConfig.brand }}
        </router-link>
      </div>
        <!--Side menu-->
    </div>

    <div class="dashboard d-flex flex-column h-100">
      <app-navbar
        :showBrand="false"
        :fixed="null">
      </app-navbar>
      <div class="dashboard-menu top">
          <!--Top menu-->
      </div>
      <main class="bg-faded">
          <div class="container p-4">
            <router-view></router-view>
          </div>
      </main>
      <app-footer></app-footer>
    </div>
  </div>
</template>

<script>
import siteConfig from '@/siteConfig'
import AppFooter from '@/components/footers/AppFooter'
import AppNavbar from '@/components/navbars/AppNavbar'

export default {
  data: function () {
    return {
      siteConfig: siteConfig
    }
  },

  props: {
    dashboard: {
      type: String,
      required: true,
      validator: value => {
        const validDashboards = [
          'admin',
          'project'
        ]
        return validDashboards.indexOf(value) > -1
      }
    }
  },

  components: {
    AppNavbar,
    AppFooter
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/main';

#dashboard-layout {
  height: 100vh;
  width: 100vw;

  main {
    flex: 1 1 auto;
  }

  .dashboard-menu {
    overflow: auto;
    white-space: nowrap;
    z-index: 1;
    background:
      linear-gradient(rgba($brand-info, 0.8),
      rgba($brand-info, 0.8)),
      url('../../assets/img/app-background.jpg');
    background-size: cover;
    background-position: center center;
    display: none;
    font-size: $font-size-sm;
    text-transform: uppercase;

    &.side {
      max-height: 100%;
      height: 100%;
      flex-direction: column;
      width: 260px;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;

      .list-group-item {
        margin:
          calc(#{$list-group-item-padding-x} - #{$list-group-item-padding-y}) 0;
        font-weight: 400;
        letter-spacing: 0.8px;

        @include media-breakpoint-up(lg) {
          font-size: $font-size-sm;
        }
      }

      ul {
        padding: 1rem 1rem 1.25rem 1rem;
        display: block;
      }

      @include media-breakpoint-up(lg) {
        display: flex;

        & + .dashboard {
          z-index: 2;
          max-height: 100%;
          float: right;
          width: calc(100% - 260px);
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
      border-radius: $border-radius-lg;
      padding: 0rem;

      a {
        padding: $list-group-item-padding-y;
        width: 100%;
        color: $white;
      }

      @include hover-focus {
        background-color: rgba($white, 0.23);
      }

      &.active {
        background-color: rgba($white, 0.33);
      }
    }

    .brand-wrapper {
      @extend .navbar-light;
      height: $app-navbar-height;
      background: transparent;
      border-bottom: 1px solid rgba($gray-lighter, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;

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
