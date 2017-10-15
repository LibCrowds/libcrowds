<template>
  <div id="newsletter">
    <div class="container my-5">
      <div class="col-lg-8 mx-auto">
        <b-card :header="title">
          <p class="lead">
            {{ lead }}
          </p>
          <template slot="footer">
            <div class="float-right">
              <b-btn
                variant="outline-secondary"
                @click="subscribe(false)">
                No thanks
              </b-btn>
              <b-btn
                variant="success"
                @click="subscribe(true)">
                Sure, sign me up!
              </b-btn>
            </div>
          </template>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import localConfig from '@/local.config'
import pybossa from '@/api/pybossa'

export default {
  layout: 'default',

  data () {
    return {
      title: 'Subscribe to our newsletter',
      lead: `Sign up to the ${localConfig.brand} newsletter to receive
            occasional updates about new features, projects and developments.`
    }
  },

  metaInfo () {
    return {
      title: this.title,
      meta: [
        {
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
      pybossa.subscribeToNewsletter(subscribe).then(res => {
        this.$router.push({ path: next })
      })
    }
  }
}
</script>
