<template>
  <div class="basic-layout" :data-bg="background">
    <main>
      <slot></slot>
    </main>
  </div>
</template>

<script>
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
    background: {
      type: String,
      default: null
    }
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
