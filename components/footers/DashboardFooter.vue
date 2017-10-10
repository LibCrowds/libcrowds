<template>
  <footer id="dashboard-footer" class="footer">
    <div class="container-fluid">
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

#dashboard-footer {
  color: $gray-600;
  background: $white;
  font-size: $font-size-sm;
  border-top: 1px solid $gray-300;
}
</style>
