<template>
  <div class="root-layout">
    <core-sidebar></core-sidebar>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import CoreSidebar from '@/components/menus/CoreSidebar'

export default {
  data: function () {
    return {
      siteConfig: this.$store.state.siteConfig
    }
  },

  components: {
    CoreSidebar
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

.root-layout {  
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  background-color: $black;
}
 
main {
  flex: 1 1 auto;
}
</style>
