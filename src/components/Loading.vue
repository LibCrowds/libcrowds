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
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  align-content: center;
  justify-content: center;

  .sk-wave {
    margin-top: 25px;
    margin-bottom: 5px;
    width: 50px;
  }

  .loading-text {
    font-size: $font-size-sm;
    text-align: center;
    color: $spinkit-spinner-color;
    margin-bottom: 25px;
    width: 100px;
    margin-right: auto;
    margin-left: auto;
  }
}
</style>
