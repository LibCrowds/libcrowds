<template>
  <div class="basic-layout" :data-bg="background">
    <main>
      <slot></slot>
    </main>
    <app-footer
      v-if="showFooter">
    </app-footer>
  </div>
</template>

<script>
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
      type: Boolean,
      default: true
    },
    navbarFixed: {
      type: String,
      default: 'top'
    },
    navbarSticky: {
      type: String,
      default: null
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
