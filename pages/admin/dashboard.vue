<template>
  <div id="admin-dashboard">
    <b-card no-body>
      <div slot="header">
        <h6 class="mb-1">{{ title }}</h6>
        <p class="text-muted mb-0">
          <small>
            Monitor recent activity.
          </small>
        </p>
      </div>
    </b-card>
  </div>
</template>

<script>
export default {
  layout: 'admin-dashboard',

  data () {
    return {
      title: 'Dashboard'
    }
  },

  head () {
    return {
      title: this.title
    }
  }
}
</script>
