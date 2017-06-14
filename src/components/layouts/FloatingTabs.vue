<template>

  <site-base>

    <div class="container mt-md-4 mb-5">

      <b-nav class="nav-unstyled">
        <b-nav-item
          v-for="item in navItems"
          v-on:click="jump('#' + item.id)"
          :key="item.id">
          {{ item.text }}
        </b-nav-item>
      </b-nav>

      <section id="content">
        <slot></slot>
      </section>

    </div>

  </site-base>

</template>

<script>
import jump from 'jump.js'
import SiteBase from '@/components/layouts/SiteBase'

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
    SiteBase
  },

  props: [
    'nav-items'
  ],

  methods: {
    jump: jump
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

section#content {
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

  @include media-breakpoint-up(md) {
    h2 { font-size: 3.5rem; }
  }
}

.nav.nav-unstyled {
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
</style>
