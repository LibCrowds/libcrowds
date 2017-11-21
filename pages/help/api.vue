<template>
  <card-base :title="title" :description="description">
    <b-card-body>
      <p>
        {{ localConfig.brand }} provides a RESTful API that can be used for
        retreiving information about tasks, task runs, results, etc. The API
        expects and returns JSON and is available at:
      </p>
      <pre class="mt-2 mb-0">
        <code>
          {{ apiBase }}
        </code>
      </pre>
      <p>
        Some requests will need an API key to authenticate and authorize the
        operation. You can find your API key listed in your profile.
      </p>
      <p>
        Rather than replicating the documentation here please refer to the
        official
        <a target="_blank" href="http://docs.pybossa.com/api/">
          PYBOSSA API documentation
        </a>
        for details.
      </p>
    </b-card-body>
  </card-base>
</template>

<script>
import localConfig from '@/local.config'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'help-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'API',
      description: `The ${localConfig.brand} API documentation.`,
      localConfig: localConfig
    }
  },

  computed: {
    apiBase () {
      if (process.browser) {
        return `${window.location.origin}/api`
      }
    }
  },

  components: {
    CardBase
  }
}
</script>
