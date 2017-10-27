<template>
  <b-card id="newsletter" :header="title">
    <p class="lead">
      {{ lead }}
    </p>
    <template slot="footer">
      <div class="text-right">
        <b-btn
          variant="outline-dark"
          @click="subscribe(false)">
          No thanks
        </b-btn>
        <b-btn
          variant="success"
          class="ml-1"
          @click="subscribe(true)">
          Sure, sign me up!
        </b-btn>
      </div>
    </template>
  </b-card>
</template>

<script>
import localConfig from '@/local.config'

export default {
  layout: 'container',

  data () {
    return {
      title: 'Subscribe to our newsletter',
      lead: `Sign up to the ${localConfig.brand} newsletter to receive
            occasional updates about new features, projects and developments.`
    }
  },

  head () {
    return {
      title: this.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.lead
        }
      ]
    }
  },

  methods: {
    /**
     * Subscribe, or otherwise.
     * @param {Boolean} subscribe
     *   True to subscribe, false otherwise.
     */
    subscribe (subscribe) {
      const next = this.$route.query.next || '/'
      this.$axios.$get(`/account/newsletter`, {
        params: {
          subscribe: subscribe ? 'True' : 'False'
        }
      }).then(data => {
        this.$router.push({ path: next })
      }).catch(err => {
        this.$nuxt.error({ statusCode: err.statusCode, message: err.message })
      })
    }
  }
}
</script>
