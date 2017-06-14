<template>

  <site-base>

    <div class="container text-center">
      <h1>{{ siteConfig.tagline }}</h1>
      <div class="my-3">
        <b-button
          variant="secondary"
          :to="{
          name: 'about',
          params: {
            shortname: siteConfig.shortname
          }
        }">
        Learn More
        </b-button>
        <b-button
          variant="success"
          :to="{
          name: 'projects',
          params: {
            shortname: siteConfig.shortname
          }
        }">
        Get Started
        </b-button>
      </div>
    </div>

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
}

h1 {
  color: $white;
}
</style>
