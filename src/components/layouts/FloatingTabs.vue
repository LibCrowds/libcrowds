<template>
  <div class="floating-tabs" :style="mainStyle">
    <app-navbar></app-navbar>
    <div class="container mt-md-4 mb-5">

      <b-nav>
        <b-nav-item
          v-for="item in navItems"
          v-on:click="jump('#' + item.id)"
          :key="item.id">
          {{ item.text }}
        </b-nav-item>
      </b-nav>

      <main>
        <slot></slot>
      </main>

    </div>
    <site-footer></site-footer>
  </div>
</template>

<script>
import jump from 'jump.js'
import AppNavbar from '@/components/AppNavbar'
import SiteFooter from '@/components/SiteFooter'

export default {
  data: function () {
    return {
      siteConfig: this.$store.state.siteConfig
    }
  },

  computed: {
    mainStyle: function () {
      return {
        backgroundImage: `url('${this.siteConfig.bgImg}')`
      }
    }
  },

  components: {
    AppNavbar,
    SiteFooter
  },

  props: [
    'nav-items'
  ],

  methods: {
    jump: jump
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

.floating-tabs {
  min-height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
}

main {
  flex: 1 1 auto;

  & > * {
    background-color: $white;
    padding: 2rem 2.5rem;

    @include media-breakpoint-up(md) {
      padding: 3rem 4.5rem;
    }

    &:nth-child(even) {
      @extend .bg-faded;
    }
  }
}

.nav {
  overflow-x: auto;
  padding: $navbar-padding-y $navbar-padding-x;
  background-color: rgba($gray-lighter, 0.85);

  .nav-link {
    color: $navbar-light-color;
  }
}

.tab-pane {
  opacity: 1;
  transition: opacity 800ms;

  &.v-enter {
    opacity: 0;
  }
}

@include media-breakpoint-up(md) {
  h2 { font-size: 3.5rem; }
}
</style>
