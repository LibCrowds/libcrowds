<template>
  <div class="loading">
    <div class="sk-wave">
      <div class="sk-rect sk-rect1"></div>
      <div class="sk-rect sk-rect2"></div>
      <div class="sk-rect sk-rect3"></div>
      <div class="sk-rect sk-rect4"></div>
      <div class="sk-rect sk-rect5"></div>
    </div>
    <p class="loading-text">
      {{ text }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: 'Loading'
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/main';
@import '~spinkit/scss/spinners/3-wave';

.loading {
  .sk-wave {
    margin-top: 25px;
    margin-bottom: 5px;
  }

  .loading-text {
    text-align: center;
    color: $spinkit-spinner-color;
    margin-bottom: 25px;
  }
}
</style>
