<template>
  <div id="admin-dashboard">
    <p>Test dash layout</p>
  </div>
</template>

<script>
import siteConfig from '@/siteConfig'

export default {
  data: function () {
    return {
      siteConfig: siteConfig
    }
  },

  metaInfo () {
    return {
      title: `Admin Dashboard`
    }
  }
}
</script>
