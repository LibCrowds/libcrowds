<template>

  <default-layout>

    <transition appear>
      <div class="container text-center">
        <h1 id="tagline">{{ config.tagline }}</h1>
        <div id="intro-buttons" class="my-3">
          <b-button variant="secondary" :to="{ name: 'about' }">
            Learn More
          </b-button>
          <b-button variant="success" :to="{ name: 'projects' }">
            Get Started
          </b-button>
        </div>
      </div>
    </transition>

  </default-layout>

</template>

<script>
import config from '@/config'
import DefaultLayout from '@/components/layouts/Default'

export default {

  data: function () {
    return {
      config: config
    }
  },

  metaInfo: {
    title: config.tagline,
    meta: [
      { name: 'description', content: config.description }
    ]
  },

  components: {
    DefaultLayout
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/_vars';
@import '~bootstrap/scss/bootstrap';

.container {
  display: flex;
  flex-direction: column;
  height: 85vh;
  justify-content: center;
  margin-bottom: 15vh;
  opacity: 1;
  transition: opacity 800ms;

  &.v-enter,
  &.v-leave-to {
    opacity: 0;
  }
}

h1 {
  color: $white;
}

</style>
