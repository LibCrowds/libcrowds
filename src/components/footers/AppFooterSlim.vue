<template>
  <footer id="app-footer-slim" class="footer">
    <div class="container">
      <p v-html="copyright" class="my-2 mx-1 float-right"></p>
    </div>
  </footer>
</template>

<script>
import siteConfig from '@/siteConfig'

export default {
  data: function () {
    return {
      copyright: `&copy; ${siteConfig.company}, ${new Date().getFullYear()}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/main';

#app-footer-slim.footer {
  color: $gray-light;
  font-size: $font-size-sm;
  border-top: 1px solid $gray-lighter;
}
</style>
