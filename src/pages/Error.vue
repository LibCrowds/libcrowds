<template>
  <div class="error">
    <div class="error-message container">
      <h1>{{ title }}</h1>
      <p class="lead">{{ description }}</p>
    </div>
    <div v-html="blOutlineSvg"></div>
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

.error-message {
  color: $white;
  text-align: center;

  h1 {
    font-weight: 600 !important;
    font-family: $headings-font-family;
  }

  @include media-breakpoint-up(md) {
    margin-left: 5%;
    width: 40%;
  }
}

p {
  color: $white;
}

.error {
  background-color: $black;
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: space-between;

  svg {
    width: 100%;
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
</style>
