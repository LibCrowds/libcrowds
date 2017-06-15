<template>
  <div class="default-layout" :style="defaultStyle">
    <app-navbar></app-navbar>
    <main>
      <slot></slot>
    </main>
    <app-footer></app-footer>
  </div>
</template>

<script>
import AppNavbar from '@/components/AppNavbar'
import AppFooter from '@/components/AppFooter'

export default {
  computed: {
    defaultStyle: function () {
      try {
        return {
          backgroundImage: `url('${require('@/custom/background.png')}')`
        }
      } catch (e) {
        return {
          backgroundImage: `url('${require('@/assets/img/background.png')}')`
        }
      }
    }
  },

  components: {
    AppNavbar,
    AppFooter
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

.default-layout {
  min-height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  display: flex;
  flex-direction: column;

  main {
    flex: 1 1 auto;
  }
}
</style>
