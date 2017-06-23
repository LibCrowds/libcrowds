<template>
  <div class="error">
    <div class="error-message container">
      <h1>{{ title }}</h1>
      <p class="lead">{{ description }}</p>
      <router-link :to="{ path: '/' }">
        <icon name="home" scale="2"></icon>
      </router-link>
    </div>
  </div>
</template>

<script>
import 'vue-awesome/icons/home'

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },

  metaInfo: {
    bodyAttrs: {
      style: `background: #7CC4F3
             url('${require('../assets/img/bl-graphic.png')}')
             no-repeat center bottom / cover fixed;`
    }
  }
}
</script>

<style>
#app-footer {
  display: none;
}
</style>

<style lang="scss" scoped>
@import 'src/assets/style/_vars';
@import '~bootstrap/scss/bootstrap';

.error {
  .error-message {
    margin-top: 1rem;
    color: $white;
    text-align: center;

    a {
      color: $white;
    }

    @include media-breakpoint-up(md) {
      margin-top: 5rem;
      margin-left: 5%;
      width: 40%;
    }
  }
}
</style>
