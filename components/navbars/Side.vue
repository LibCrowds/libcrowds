<template>
  <b-nav
    ref="sidebar"
    :class="sideNavClass"
    v-prevent-parent-scroll>
    <div class="header">
      <b-btn
        variant="link"
        class="d-flex align-items-center float-right"
        @click="$emit('menuclick')">
        Close<icon name="times" class="ml-1"></icon>
      </b-btn>
    </div>

    <span v-for="(items, key, index) in navItems" :key="key">
      <h4>{{ key }}</h4>
      <b-nav-item
        v-for="(item, index) in items"
        exact
        :key="index"
        :to="item.link">
        {{ item.label }}
      </b-nav-item>
      <li
        v-if="index !== navItems.length"
        role="seperator"
        class="divider">
      </li>
    </span>

    <div class="d-flex align-items-center justify-content-between my-2 px-2">
      <label class="mr-1 mb-0 toggle-label text-secondary">
        <strong>Activate dark mode</strong>
      </label>
      <no-ssr>
        <toggle-button
          :value="darkMode"
          :labels="true"
          class="mb-0"
          @change="toggleDarkMode">
        </toggle-button>
      </no-ssr>
    </div>

  </b-nav>
</template>

<script>
import 'vue-awesome/icons/times'
import { currentMicrositeNavItems } from '@/mixins/currentMicrositeNavItems'
import localConfig from '@/local.config'

export default {
  mixins: [ currentMicrositeNavItems ],

  data () {
    return {
      localConfig: localConfig
    }
  },

  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },

    publishedCollections () {
      return this.$store.state.publishedCollections
    },

    darkMode () {
      return this.$store.state.darkMode
    },

    sideNavClass () {
      return {
        'side-nav': true,
        'show': this.value,
        'side-nav-dark': this.darkMode
      }
    },

    navItems () {
      const items = {}

      // Microsite nav items
      if (this.currentMicrositeNavItems.length) {
        items[''] = this.currentMicrositeNavItems
      }

      // Collection hompage nav items
      items['Collections'] = this.publishedCollections.map(coll => {
        return {
          label: coll.name,
          link: {
            name: 'collection-short_name',
            params: {
              short_name: coll.short_name
            }
          }
        }
      })

      // Admin nav items
      if (this.currentUser.admin) {
        items['Admin'] = [
          {
            label: 'Collection Admin',
            link: {
              name: 'admin-collection'
            }
          },
          {
            label: 'Project Admin',
            link: {
              name: 'admin-project'
            }
          },
          {
            label: 'Site Admin',
            link: {
              name: 'admin-site'
            }
          }
        ]
      }
      return items
    }
  },

  methods: {
    /**
     * Toggle dark mode.
     */
    toggleDarkMode () {
      this.$cookies.set('dark-mode', !this.$store.state.darkMode)
      this.$store.dispatch('TOGGLE_DARK_MODE')
    },

    /**
     * Restrict body content to avoid multiple scroll bars.
     */
    restrictBody () {
      const sidebar = this.$refs.sidebar
      let height = '100%'
      let overflow = 'initial'
      if (
        typeof sidebar !== 'undefined' &&
        sidebar.classList.contains('show') &&
        window.innerWidth < 576
      ) {
        height = '100vh'
        overflow = 'hidden'
      }
      document.querySelector('body').style.height = height
      document.querySelector('body').style.overflow = overflow
    }
  },

  watch: {
    value () {
      setTimeout(() => {
        this.restrictBody()
      }, 350)
    }
  },

  mounted () {
    window.addEventListener('resize', this.restrictBody)
  },

  destroyed () {
    window.removeEventListener('resize', this.restrictBody)
  }
}
</script>

<style lang="scss">
@import '~assets/style/settings';

.side-nav {
  overflow: auto;
  white-space: nowrap;
  background-size: cover;
  background-position: center center;
  background: $gray-100;
  max-height: 100%;
  height: 100%;
  flex-direction: column;
  width: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: $zindex-modal;
  border-right: 1px solid $gray-300;
  transform: translateX(-100%);
  transition: all 350ms ease-out;

  .btn {
    text-transform: uppercase;
    font-size: $font-size-sm;
    color: inherit;
    cursor: pointer;

    svg {
      margin-bottom: 2px;
    }

    @include hover-focus {
      text-decoration: none;
    }
  }

  &.side-nav-dark {
    color: $white;
    background: $gray-1000;
    border-right: 1px solid $gray-1200;
  }

  @include media-breakpoint-up(sm) {
    width: $sidebar-width;
  }

  &.show {
    transform: translateX(0);
  }

  h4 {
    color: $gray-600;
    text-transform: uppercase;
    margin: 0;
    padding: .75rem 1.25rem;
    font-size: $font-size-sm;
    font-family: inherit;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: sticky;
    width: 100%;
    top: 0;
    z-index: 2;
    height: $top-navbar-height;
    min-height: $top-navbar-height;
    border-bottom: 1px solid rgba($gray-300, 0.75);
  }

  .nav-item {
    font-size: $font-size-sm;
    display: flex;
    margin: 0;
    letter-spacing: 0.8px;
    border: none;
    background-color: transparent;
    padding: 0rem;

    .nav-link {
      padding: 0.5rem 1.25rem;
      width: 100%;
      color: inherit;
      display: block;

      @include hover-focus {
        text-decoration: none;
        background-color: rgba($gray-600, 0.2);
      }
    }
  }

  ul {
    display: block;
  }

  .divider {
    height: 0;
    margin: .5rem 0;
    overflow: hidden;
    border-bottom: 1px solid rgba($gray-300, 0.5);
  }
}
</style>
