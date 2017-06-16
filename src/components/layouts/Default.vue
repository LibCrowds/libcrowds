<template>
  <div class="default-layout" :style="defaultStyle">
    <div class="full-height">
      <app-navbar></app-navbar>
      <main>
        <slot></slot>
      </main>
    </div>
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
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;

  .full-height {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  main {
    color: $white;
    justify-content: center;
    align-content: center;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
  }
}
</style>
