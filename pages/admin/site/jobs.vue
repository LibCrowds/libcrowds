<template>
  <card-base :title="title" help="Monitor background tasks">
    <iframe
      :src="rqSchedulerRoute"
      height="800"
      width="100%"
      frameborder="0">
    </iframe>
  </card-base>
</template>

<script>
import localConfig from '@/local.config'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-site-dashboard',

  data () {
    return {
      title: 'Background Tasks',
      rqSchedulerRoute: `${localConfig.pybossa.host}/admin/rq`
    }
  },

  components: {
    CardBase
  },

  head () {
    return {
      title: this.title
    }
  }
}
</script>
