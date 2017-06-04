<template>
  <div class="sub-navbar">
    <ul class="nav sub-nav">
      <li class="nav-item" v-for="item in items">
        <a class="nav-link active" :href="item.href">{{ item.value }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'sub-navbar',
  props: [ 'items' ]
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

.nav {
  padding: $navbar-padding-y $navbar-padding-x;
  background-color: rgba($gray-lighter, 0.85);

  .nav-link {
    color: $navbar-light-color;
  }
}
</style>
