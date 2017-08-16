<template>
  <div class="floating-tabs-layout">
    <main>
      <div class="container mb-5">
        <transition-group name="fade" mode="out-in" appear>
          <b-nav class="nav-unstyled" key="fading-nav">
            <b-nav-item
              v-for="item in navItems"
              v-on:click="jump('#' + item.id)"
              :key="item.id">
              {{ item.text }}
            </b-nav-item>
            <b-nav-item id="hidden-item">&nbsp;</b-nav-item>
          </b-nav>
          <section id="content" key="fading-content">

            <slot></slot>

          </section>
        </transition-group>
      </div>
    </main>
  </div>
</template>

<script>
import jump from 'jump.js'

export default {
  props: {
    navItems: {
      type: Array
    }
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

    /* Internal sections */
    & > section {
      transition: opacity 600ms;
      padding: 2rem 2.5rem;

      @include media-breakpoint-up(md) {
        padding: 3rem 4rem;
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
      font-size: $font-size-sm;

      transition: opacity 500ms ease;
      color: lighten($gray, 15%);
      display: none;

      @include media-breakpoint-up(sm) {
        display: block;
      }
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 500ms ease;
  }

  .fade-enter .nav-link,
  .fade-enter section,
  .fade-leave-to .nav-link,
  .fade-leave-to section {
    opacity: 0;
  }
}
</style>
