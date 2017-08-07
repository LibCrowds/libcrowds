<template>
  <div class="basic-layout">
    <app-navbar v-if="showNavbar"></app-navbar>
    <main>
      <slot></slot>
    </main>
    <app-footer v-if="showFooter"></app-footer>
  </div>
</template>

<script>
import AppNavbar from '@/components/AppNavbar'
import AppFooter from '@/components/AppFooter'

export default {
  props: {
    showNavbar: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: true
    }
  },

  components: {
    AppNavbar,
    AppFooter
  }
}
</script>
