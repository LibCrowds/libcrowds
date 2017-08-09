<template>
  <div class="floating-tabs-layout">
    <app-navbar
      :sticky="'top'"
      :fixed="null">
    </app-navbar>
    <main>
      <div class="container mb-5">
        <transition-group appear>
          <b-nav class="nav-unstyled" key="fading-nav">
            <b-nav-item
              v-for="item in navItems"
              v-on:click="jump('#' + item.id)"
              :key="item.id">
              {{ item.text }}
            </b-nav-item>
          </b-nav>
          <section id="content" key="fading-content">
            <slot></slot>
          </section>
        </transition-group>
      </div>
    </main>
    <app-footer></app-footer>
  </div>
</template>

<script>
import jump from 'jump.js'
import AppNavbar from '@/components/AppNavbar'
import AppFooter from '@/components/AppFooter'

export default {
  props: {
    navItems: {
      type: Array
    }
  },

  components: {
    AppNavbar,
    AppFooter
  },

  methods: {
    jump: jump
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/main';

.floating-tabs-layout {
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;

  section#content {
    background-color: $white;

    &.v-enter,
    &.v-leave-to {
      & > * {
        opacity: 0;
      }
    }

    /* Internal sections */
    & > * {
      opacity: 1;
      transition: opacity 600ms;
      padding: 2rem 2.5rem;

      @include media-breakpoint-up(md) {
        padding: 3rem 4.5rem;
      }

      &:nth-child(even) {
        @extend .bg-faded;
      }

      @include media-breakpoint-up(md) {
        h2 { font-size: 3.5rem; }
      }
    }
  }

  .nav.nav-unstyled {
    overflow-x: auto;
    padding: $navbar-padding-y $navbar-padding-x;
    background-color: rgba($gray-lighter, 0.85);

    .nav-link {
      opacity: 1;
      transition: opacity 600ms;
      color: $navbar-light-color;
    }

    &.v-enter,
    &.v-leave-to {
      .nav-link {
        opacity: 0;
      }
    }
  }
}
</style>
