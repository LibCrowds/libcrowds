<template>
  <div class="error">
    <b-jumbotron :header="title" :lead="description">
      <b-btn variant="white" :to="{ path: '/' }">Go Home</b-btn>
    </b-jumbotron>
  </div>
</template>

<script>
export default {
  name: 'error',

  props: [
    'title',
    'description'
  ],

  metaInfo: {
    title: this.title,
    description: this.description
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';
@import '~bootstrap-vue/dist/bootstrap-vue';

h1 {
  color: $white;
  font-weight: 600 !important;
}

p {
  color: $white;
}

.btn-white {
  @include button-outline-variant($white, $black);
  cursor: pointer;
}

.jumbotron {
  display: flex;
  height: 100vh;
  border-radius: 0;
  margin-bottom: 0;
  background-color: #7CC4F3;
  background-image: url("../assets/img/bl-graphic.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  background-position: center;

  .container {
    margin-left: 0;
    text-align: center;
    width: 40%;
  }
}
</style>
