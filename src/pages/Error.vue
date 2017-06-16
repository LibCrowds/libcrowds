<template>
  <div class="error">
    <div class="error-message container">
      <h1>{{ title }}</h1>
      <p class="lead">{{ description }}</p>
    </div>
    <div id="bl-outline" v-html="blOutlineSvg"></div>
  </div>
</template>

<script>
import blOutlineSvg from '@/assets/img/bl-outline.svg'

export default {
  name: 'error',
  data: () => ({
    blOutlineSvg: blOutlineSvg
  }),

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
@import 'src/assets/style/_vars';
@import '~bootstrap/scss/bootstrap';

.navbar {
    position: absolute;
}

.error {
  background-color: $black;
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: space-between;

  #bl-outline {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .error-message {
    color: $white;
    flex: 1 1 auto;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    text-align: center;

    @include media-breakpoint-up(md) {
      margin-left: 5%;
      width: 40%;
    }
  }

  path#mainline {
    animation: dash 3s linear forwards;
  }

  path:not(#mainline) {
    animation: dash 500ms linear 3s forwards;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }
}
</style>
