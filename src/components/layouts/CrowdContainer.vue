<template>
  <div id="landing">
    <div class="jumbotron">
      <div class="container">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/_vars';
@import '~bootstrap/scss/bootstrap';

.jumbotron {
  padding: 2em;
  display: flex;
  height: 100vh;
  border-radius: 0;
  margin-bottom: 0;
  background-image: url("../../assets/img/crowd.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
  align-items: center;
  justify-content: center;

  .container {
    align-items: center;
    display: flex;
    flex-direction: column;
    text-align: center;
    color: $white;
    overflow: auto;
  }
}
</style>
