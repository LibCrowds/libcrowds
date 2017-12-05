<template>
  <card-base :header="title">
    <p class="lead">
      {{ description }}
    </p>
    <template slot="footer">
      <div class="text-right">
        <b-btn
          variant="dark"
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
  </card-base>
</template>

<script>
import { handleHashedFlashes } from '@/mixins/handleHashedFlashes'
import { metaTags } from '@/mixins/metaTags'
import localConfig from '@/local.config'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'container',

  mixins: [ handleHashedFlashes, metaTags ],

  data () {
    return {
      title: 'Subscribe to our newsletter',
      description: `Sign up to the ${localConfig.brand} newsletter to receive
        occasional updates about new features, projects and developments.`
    }
  },

  components: {
    CardBase
  },

  methods: {
    /**
     * Subscribe, or otherwise.
     * @param {Boolean} subscribe
     *   True to subscribe, false otherwise.
     */
    subscribe (subscribe) {
      // We can't guarantee the format of the next param returned after OAuth
      // so add an additional check that it is at least just a pathname.
      const parser = document.createElement('a')
      parser.href = this.$route.query.next || '/'
      const next = parser.pathname

      if (subscribe) {
        this.$axios.$get(`/account/newsletter`, {
          params: {
            subscribe: 'True'
          }
        }).then(data => {
          this.$router.push({ path: next })
        }).catch(err => {
          this.$nuxt.error(err)
        })
      } else {
        this.$router.push({ path: next })
      }
    }
  }
}
</script>
