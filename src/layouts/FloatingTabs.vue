<template>
  <div class="floating-tabs-layout">
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
            <router-view
              :currentUser="currentUser"
              :collectionConfig="collectionConfig"
              @navupdated="onNavUpdated">
            </router-view>
          </transition>
        </section>

      </div>
    </main>
  </div>
</template>

<script>
import jump from 'jump.js'

export default {
  data: function () {
    return {
      navItems: []
    }
  },

  props: {
    currentUser: {
      type: Object,
      required: true
    },
    collectionConfig: {
      type: Object,
      required: true
    }
  },

  methods: {
    /**
     * Handle nav item update.
     * @param {Array} navItems
     *   The nav items.
     */
    onNavUpdated (navItems) {
      this.navItems = navItems
    },

    /**
     * Navigate.
     * @param {Object} navItem
     *   The nav item.
     */
    navigate (navItem) {
      if (navItem.route) {
        this.$router.push(navItem.route)
      } else {
        jump('#' + navItem.id)
      }
    }
  },

  beforeRouteLeave (to, from, next) {
    // Clear navitems to make the transition nicer
    this.navItems = []
    next()
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/main';

.floating-tabs-layout {
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;

  #content {
    background-color: $white;

    /* Internal sections */
    & > * > section {
      transition: opacity 600ms;
      padding: 2rem 2.5rem;

      @include media-breakpoint-up(md) {
        padding: 3rem 4rem;
      }

      &:nth-child(even) {
        @extend .bg-light;
      }

      @include media-breakpoint-up(md) {
        h2 { font-size: 3.5rem; }
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
