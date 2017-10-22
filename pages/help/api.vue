<template>
  <b-card header="API">
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
  </b-card>
</template>

<script>
import localConfig from '@/local.config'

export default {
  layout: 'help-dashboard',

  data () {
    return {
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

  head () {
    return {
      title: 'API',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `The ${localConfig.brand} API documentation.`
        }
      ]
    }
  }
}
</script>
