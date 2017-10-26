<template>
  <div id="admin-jobs">
    <b-card no-body>
      <template slot="header">
        <h6 class="mb-0">{{ title }}</h6>
        <p class="text-muted mb-0">
          <small>
            Monitor background tasks.
          </small>
        </p>
      </template>
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
  layout: 'admin-dashboard',

  data () {
    return {
      title: 'Background Tasks',
      rqSchedulerRoute: `${localConfig.pybossa.host}/admin/rq`
    }
  },

  head () {
    return {
      title: this.title
    }
  }
}
</script>
