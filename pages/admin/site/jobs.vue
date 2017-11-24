<template>
  <card-base :title="title" :description="description">
    <iframe
      :src="rqSchedulerRoute"
      height="800"
      width="100%"
      frameborder="0">
    </iframe>
  </card-base>
</template>

<script>
import { metaTags } from '@/mixins/metaTags'
import localConfig from '@/local.config'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-site-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'Background Tasks',
      description: 'Manage the platform\'s background tasks.',
      rqSchedulerRoute: `${localConfig.pybossaHost}/admin/rq`
    }
  },

  components: {
    CardBase
  }
}
</script>
