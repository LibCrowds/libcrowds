<template>

  <site-base>

    <section>
      <h1>Playbills</h1>
    </section>

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
