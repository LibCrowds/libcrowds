<template>
  <collection-base>
    <div id="collection-tabs-layout">
      <main>
        <div class="container mb-5">

          <b-nav class="nav-unstyled" key="fading-nav">
            <b-nav-item
              v-for="item in navItems"
              @click="navigate(item)"
              :key="item.id">
              <transition name="fade" mode="out-in" appear>
                <span>{{ item.text }}</span>
              </transition>
            </b-nav-item>
            <b-nav-item id="hidden-item">&nbsp;</b-nav-item>
          </b-nav>

          <section id="content" key="fading-content">
            <transition name="fade" mode="out-in" appear>
              <nuxt></nuxt>
            </transition>
          </section>
        </div>
      </main>
    </div>
  </collection-base>
</template>

<script>
import CollectionBase from '@/layouts/bases/Collection'

export default {
  components: {
    CollectionBase
  },

  computed: {
    navItems () {
      return this.$store.state.collectionNavItems
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
@import '~assets/style/settings';

#collection-tabs-layout {
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  min-height: 100vh;

  #content {
    background-color: $white;

    h1, h2, h3 {
      padding-top: 2.5rem;
      border-top: 1px solid $gray-300;
      text-align: center;
    }

    transition: opacity 600ms;
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
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 300ms ease;
  }

  .fade-enter .nav-link,
  .fade-enter section,
  .fade-leave-to .nav-link,
  .fade-leave-to section {
    opacity: 0;
  }
}
</style>
