<template>
  <div id="error-page">
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
    title: 'Error',
    bodyAttrs: {
      style: `background: #7CC4F3
             url('${require('../assets/img/bl-graphic.png')}')
             no-repeat center bottom / cover fixed;`
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/main';

#error-page {
  .error-message {
    margin-top: 0;
    height: 100vh;
    color: $white;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    a {
      color: $white;
    }

    @include media-breakpoint-up(md) {
      margin-left: 5%;
      width: 40%;
    }
  }
}
</style>
