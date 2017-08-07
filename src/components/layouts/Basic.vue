<template>
  <div class="basic-layout" :data-bg="background">
    <app-navbar
      v-if="showNavbar"
      :type="navbarType"
      :invertable="navbarInvertable">
    </app-navbar>
    <main class="mt-5 mb-3">
      <slot></slot>
    </main>
    <app-footer
      v-if="showFooter">
    </app-footer>
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
    navbarType: {
      type: String,
      default: 'inverse'
    },
    navbarInvertable: {
      type: String,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    background: {
      type: String,
      default: null
    }
  },

  components: {
    AppNavbar,
    AppFooter
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/main';

.basic-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  main {
    flex: 1 1 auto;
  }

  &[data-bg="faded"] {
    @extend .bg-faded;
  }
}
</style>
