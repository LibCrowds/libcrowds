<template>
  <div
    ref="sidebar"
    :class="sideNavClass">
    <div class="header">
      <b-btn
        variant="link"
        class="d-flex align-items-center float-right"
        @click="$emit('close')">
        Close<icon name="times" class="ml-1"></icon>
      </b-btn>
    </div>

    <div id="side-nav-items" class="custom-scrollbar" v-prevent-parent-scroll>

      <div v-for="(items, key, index) in sideNavItems" :key="key">
        <h4>{{ key }}</h4>
        <b-nav>
          <b-nav-item
            v-for="(item, index) in items"
            exact
            :key="index"
            :to="item.link"
            :active-class="item.activeClass"
            @click="$emit('itemclick', item.link)">
            {{ item.label }}
          </b-nav-item>
          <li
            v-if="index !== sideNavItems.length"
            role="seperator"
            class="divider">
          </li>
        </b-nav>
      </div>

      <div class="d-flex align-items-center justify-content-between my-2 px-2">
        <label class="mr-1 mb-0 toggle-label text-secondary">
          <strong>Activate dark mode</strong>
        </label>
        <no-ssr>
          <toggle-button
            :value="dark"
            :labels="true"
            class="mb-0"
            @change="toggleDarkMode">
          </toggle-button>
        </no-ssr>
      </div>

    </div>
  </div>
</template>

<script>
import 'vue-awesome/icons/times'
import isEmpty from 'lodash/isEmpty'
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
    },
    navItems: {
      type: Object,
      default: () => ({})
    },
    fixed: {
      type: Boolean,
      default: false
    },
    dark: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },

    loggedIn () {
      return !isEmpty(this.currentUser)
    },

    publishedCollections () {
      return this.$store.state.publishedCollections
    },

    sideNavClass () {
      return {
        'side-nav': true,
        'show': this.value,
        'side-nav-dark': this.dark,
        'side-nav-fixed': this.fixed
      }
    },

    sideNavItems () {
      const items = JSON.parse(JSON.stringify(this.navItems))
      const canBuild = (
        this.loggedIn &&
        (this.currentUser.admin || !localConfig.disableProjectBuilder)
      )

      // Microsite nav items
      if (this.currentMicrositeNavItems.length) {
        items[''] = this.currentMicrositeNavItems
      }

      // Collection hompage nav items
      items['Collections'] = this.publishedCollections.map(coll => {
        return {
          label: coll.name,
          activeClass: 'active-unstyled',
          link: {
            name: 'collection-short_name',
            params: {
              short_name: coll.short_name
            }
          }
        }
      })

      // Project admin
      if (canBuild) {
        items['Projects'] = [
          {
            label: 'New Project',
            link: {
              name: 'admin-project-new'
            }
          },
          {
            label: 'Open Project',
            link: {
              name: 'admin-project'
            }
          }
        ]
      }

      // Templates admin
      if (canBuild) {
        items['Templates'] = [
          {
            label: 'New Template',
            link: {
              name: 'account-name-templates-new',
              params: {
                name: this.currentUser.name
              }
            }
          },
          {
            label: 'Open Template',
            link: {
              name: 'account-name-templates',
              params: {
                name: this.currentUser.name
              }
            }
          }
        ]
      }

      // Site/collection admin
      if (this.currentUser.admin) {
        items['Admin'] = [
          {
            label: 'New Collection',
            link: {
              name: 'admin-collection-new'
            }
          },
          {
            label: 'Open Collection',
            link: {
              name: 'admin-collection'
            }
          },
          {
            label: 'Dashboard',
            exact: true,
            link: {
              name: 'admin-site'
            }
          },
          {
            label: 'Users',
            link: {
              name: 'admin-site-users'
            }
          },
          {
            label: 'Announcements',
            link: {
              name: 'admin-site-announcements'
            }
          },
          {
            label: 'Background Tasks',
            link: {
              name: 'admin-site-jobs'
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
  display: block;
  white-space: nowrap;
  background-size: cover;
  background-position: center center;
  background: $gray-100;
  max-height: 100%;
  height: 100%;
  flex-direction: column;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: $zindex-modal;
  min-width: 0;
  width: 0;
  transition: all 350ms ease-out;

  @include media-breakpoint-up(sm) {
    position: relative;

    &.side-nav-fixed {
      position: fixed;
    }
  }

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

  &.show {
    min-width: 100%;
    width: 100%;
    border-right: 1px solid $gray-200;
    white-space: normal;
    word-wrap: break-word;

    @include media-breakpoint-up(sm) {
      min-width: $sidebar-width;
      width: $sidebar-width;
    }
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
    width: 100%;
    top: 0;
    z-index: 2;
    height: $top-navbar-height;
    min-height: $top-navbar-height;
    border-bottom: 1px solid $gray-300;
    background: $gray-100;
  }

  #side-nav-items {
    height: calc(100vh - #{$top-navbar-height});
    overflow-y: auto;
    right: 0;
    position: absolute;
    width: 100%;

    @include media-breakpoint-up(sm) {
      width: $sidebar-width;
    }
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

      &:hover {
        text-decoration: none;
        background-color: rgba($gray-600, 0.2);
      }

      &.active:not(.active-unstyled) {
        color: $blue;
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
    border-bottom: 1px solid $gray-200;
  }

  &.side-nav-dark {
    color: $white;
    background: $gray-1000;
    border-color: $gray-900;

    .header {
      background: $gray-1000;
      border-color: $gray-800;
    }

    .divider {
      border-color: $gray-900;
    }
  }
}
</style>
