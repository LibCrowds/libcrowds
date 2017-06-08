<template>
  <div class="floating-tabs" :style="mainStyle">
    <app-navbar></app-navbar>
      <div class="container mt-md-4 mb-5">

        <slot name="nav"></slot>

        <main>
          <slot></slot>
        </main>

      </div>
    <app-footer></app-footer>
  </div>
</template>

<script>
import AppNavbar from '@/components/AppNavbar'
import AppFooter from '@/components/AppFooter'

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
    AppFooter
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
}

.nav {
  overflow-x: auto;
  padding: $navbar-padding-y $navbar-padding-x;
  background-color: rgba($gray-lighter, 0.85);

  .nav-link {
    color: $navbar-light-color;
  }
}

section {
  background-color: $white;
  padding: 2rem 2.5rem;

  @include media-breakpoint-up(md) {
    padding: 3rem 4.5rem;
  }

  &:nth-child(even) {
    @extend .bg-faded;
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
