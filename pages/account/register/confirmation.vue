<template>
  <card-base>
    <b-alert
      show
      variant="info"
      class="m-2">
      Confirming email address...
    </b-alert>
  </card-base>
</template>

<script>
import CardBase from '@/components/cards/Base'

export default {
  layout: 'container',

  components: {
    CardBase
  },

  mounted () {
    this.$axios.$get('/account/register/confirmation', {
      params: this.$route.query
    }).then(data => {
      this.$notifications.flash(data)
      this.$router.push({ path: data.next })
    }).catch(err => {
      error(err)
    })
  }
}
</script>
