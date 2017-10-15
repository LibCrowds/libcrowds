<template>
  <div id="admin-jobs">
    <b-card no-body header="Background Jobs">
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
import localConfig from '@/local.config'

export default {
  data: function () {
    return {
      rqSchedulerRoute: `${localConfig.pybossa.host}/admin/rq`
    }
  },

  metaInfo () {
    return {
      title: 'Background Jobs'
    }
  }
}
</script>
