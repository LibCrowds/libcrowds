<template>
  <div id="admin-background-jobs">
    <b-card no-block header="Background Jobs">
      <iframe
        :src="rqSchedulerRoute"
        height="800"
        width="100%"
        frameborder="0">
      </iframe>
    </b-card>
  </div>
</template>

<script>
import siteConfig from '@/siteConfig'

export default {
  data: function () {
    return {
      rqSchedulerRoute: `${siteConfig.pybossaHost}/admin/rq`
    }
  },

  metaInfo () {
    return {
      title: 'Background Jobs'
    }
  }
}
</script>
