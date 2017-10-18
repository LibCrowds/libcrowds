<template>
  <b-card header="API">
    <p>
      {{ localConfig.brand }} provides a RESTful API that can be used for
      retreiving information about tasks, task runs, results, etc. The API
      expects and returns JSON and is available at:
    </p>
    <pre class="mt-2 mb-0">
      <code>
        {{ localConfig.pybossa.host }}/api
      </code>
    </pre>
    <p>
      Some requests will need an API key to authenticate and authorize the
      operation. You can find your API key listed in your profile.
    </p>
    <p>
      Rather than replicating the documentation here please refer to the
      official
      <a href="http://docs.pybossa.com/api/">
        PYBOSSA API documentation
      </a>
      for details.
    </p>
  </b-card>
</template>

<script>
import localConfig from '@/local.config'

export default {
  layout: 'dashboards/help',

  data () {
    return {
      localConfig: localConfig
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
