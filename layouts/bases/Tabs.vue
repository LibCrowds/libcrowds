<template>
  <default-base
    transparent
    :class="darkMode ? 'dark-mode' : null"
    :navbar-brand="navbarBrand"
    :background-image-url="backgroundImageUrl">

    <div id="collection-tabs-layout" class="container mt-2 mb-5">

      <b-nav class="nav-unstyled">
        <b-nav-item
          v-for="item in navItems"
          @click="navigate(item)"
          :key="item.id">
          <transition name="fade" mode="out-in" appear>
            <span>{{ item.text }}</span>
          </transition>
        </b-nav-item>
        <b-nav-item id="hidden-item">&nbsp;</b-nav-item>

        <slot name="right"></slot>

      </b-nav>

      <main>
        <transition name="fade" mode="out-in" appear>
          <nuxt></nuxt>
        </transition>
      </main>

    </div>
  </default-base>
</template>

<script>
import DefaultBase from '@/layouts/bases/Default'

export default {
  components: {
    DefaultBase
  },

  props: {
    navItems: {
      type: Array,
      default: () => ([])
    },
    backgroundImageUrl: {
      type: String,
      required: true
    },
    navbarBrand: {
      type: String,
      required: true
    }
  },

  methods: {
    /**
     * Navigate.
     * @param {Object} navItem
     *   The nav item.
     */
    navigate (navItem) {
      if (navItem.route) {
        this.$router.push(navItem.route)
      } else if (process.browser) {
        const VueScrollTo = require('vue-scrollto')
        VueScrollTo.scrollTo('#' + navItem.id)
      }
    }
  }
}
</script>

<style lang="scss">
#collection-tabs-layout {
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  min-height: 100vh;

  &>main {
    background-color: $white;

    h1, h2, h3 {
      text-align: center;
    }

    h2 {
      padding-top: 2.5rem;
      border-top: 1px solid $gray-300;
    }

    padding: 2rem 2.5rem;

    @include media-breakpoint-up(md) {
      padding: 3rem 4rem;
    }

    hr {
      margin: 3rem;
    }

    h1 {
      padding-bottom: 1rem;
      border-bottom: 1px solid $gray-300;

      @include media-breakpoint-up(md) {
        font-size: 3.5rem;
        margin-top: 0;
      }
    }
  }

  .nav.nav-unstyled {
    overflow-x: auto;
    padding: $navbar-padding-y $navbar-padding-x;
    background-color: rgba($gray-300, 0.85);

    .nav-link {
      font-size: $font-size-sm;

      transition: opacity 350ms ease;
      color: rgba($gray-700, 0.85);
      display: none;

      @include media-breakpoint-up(sm) {
        display: block;
      }
    }

    #hidden-item a {
      cursor: default;
    }
  }
}

.dark-mode {
  #collection-tabs-layout {
    .nav.nav-unstyled {
      background-color: rgba($gray-800, 0.9);

      .nav-link {
        color: rgba($gray-300, 0.85);
      }
    }

    &>main {
      color: $gray-200;
      background-color: $gray-900;
    }
  }
}
</style>
