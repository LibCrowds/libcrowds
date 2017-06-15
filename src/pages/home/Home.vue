<template>

  <site-base>

    <transition appear>
      <div class="container text-center">
        <h1 id="tagline">{{ siteConfig.tagline }}</h1>
        <div id="intro-buttons" class="my-3">
          <b-button
            variant="secondary"
            :to="{
            name: 'about',
            params: {
              sitename: siteConfig.shortname
            }
          }">
          Learn More
          </b-button>
          <b-button
            variant="success"
            :to="{
            name: 'projects',
            params: {
              sitename: siteConfig.shortname
            }
          }">
          Get Started
          </b-button>
        </div>
      </div>
    </transition>

  </site-base>

</template>

<script>
import SiteBase from '@/components/layouts/SiteBase'

export default {
  data: function () {
    return {
      siteConfig: this.$store.state.siteConfig
    }
  },

  components: {
    SiteBase
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
