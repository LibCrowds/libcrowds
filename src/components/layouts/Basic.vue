<template>
  <div class="basic-layout" :data-bg="background">
    <main>
      <slot></slot>
    </main>
  </div>
</template>

<script>
export default {}
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

  &[data-bg="geometry"] {
    background-image: url('../../assets/img/geometry.png');
  }
}
</style>
