<template>
  <div class="default-layout">
    <slot></slot>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

.default-layout {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  color: $white;
  flex: 1 1 auto;
}
</style>
