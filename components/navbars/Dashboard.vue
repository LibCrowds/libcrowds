<template>
  <nav id="dashboard-navbar" :class="classObj">
    <div class="brand-wrapper navbar-light text-center">
      <nuxt-link
        class="brand navbar-brand"
        :to="{
          name: 'index'
        }">
        {{ localConfig.brand }}
      </nuxt-link>
    </div>

    <transition-group
      appear
      name="dashboard-slide-in"
      class="nav"
      tag="ul"
      :css="false"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave">
      <b-nav-item
        v-for="(item, index) in navItems"
        exact
        :key="index"
        :data-index="index"
        :to="item.link">
        {{ item.label }}
      </b-nav-item>
    </transition-group>
  </nav>
</template>

<script>
import Velocity from 'velocity-animate'
import localConfig from '@/local.config'

export default {
  data () {
    return {
      localConfig: localConfig
    }
  },

  props: {
    navItems: {
      type: Array,
      required: true
    },
    position: {
      type: String,
      default: 'top',
      validator: value => {
        const validPositions = [
          'top',
          'side'
        ]
        return validPositions.indexOf(value) > -1
      }
    }
  },

  computed: {
    classObj () {
      return {
        top: this.position === 'top',
        side: this.position === 'side',
        'dashboard-nav-bg': true
      }
    }
  },

  methods: {
    beforeEnter (el) {
      el.style.opacity = 0
      el.style.translateX = 0
    },

    enter (el, done) {
      if (!el.dataset) {
        return
      }
      const delay = el.dataset.index * 150
      setTimeout(() => {
        Velocity(
          el,
          { opacity: 1, translateX: [0, '-100%'] },
          { complete: done }
        )
      }, delay)
    },

    leave (el, done) {
      Velocity(
        el,
        { opacity: 0 },
        { complete: done }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/style/settings';

#dashboard-navbar {
  overflow: auto;
  white-space: nowrap;
  z-index: 1;
  background-size: cover;
  background-position: center center;
  display: none;
  font-size: $font-size-xs;
  text-transform: uppercase;

  .brand-wrapper {
    display: none;
    height: $app-navbar-height;
    background: transparent;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid rgba($gray-300, 0.5);
    min-height: $app-navbar-height;

    .brand {
      margin: 0;
      color: $white;

      @include hover-focus {
        color: $white;
      }
    }
  }

  .nav-item {
    border: none;
    background-color: transparent;
    padding: 0rem;

    .nav-link {
      padding: 0.75rem 1.25rem;
      width: 100%;
      color: $white;
      display: block;

      &:hover,
      &:focus,
      &.active {
        text-decoration: none;
        background-color: rgba($blue, 0.45);
      }
    }
  }

  &.side {
    max-height: 100%;
    height: 100%;
    flex-direction: column;
    width: $sidebar-width;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;

    .brand-wrapper {
      display: flex;
    }

    .nav-item {
      margin:
        calc(#{$list-group-item-padding-x} - #{$list-group-item-padding-y}) 0;
      font-weight: 400;
      letter-spacing: 0.8px;

      &:first-child {
        margin-top: 0;
      }
    }

    ul {
      display: block;
    }

    @include media-breakpoint-up(lg) {
      display: flex;

      & + .dashboard {
        z-index: 2;
        max-height: 100%;
        float: right;
        width: calc(100% - #{$sidebar-width});
      }
    }
  }

  &.top {
    .nav-item {
      flex-direction: row;
      margin: calc(#{$list-group-item-padding-x} - #{$list-group-item-padding-y});
    }

    ul {
      padding: 0.5rem 1rem;
      flex-direction: row;
    }

    @include media-breakpoint-down(md) {
      display: flex;
    }
  }
}
</style>
