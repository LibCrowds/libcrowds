<template>
  <section>
    <p>
      {{ config.brand }} provides a RESTful API that can be used for retreiving
      information about tasks, task runs, results, etc. The API expects and 
      returns JSON and is available at:
    </p>
    <pre class="my-2">
      <code>
        {{ apiUrl }}
      </code>
    </pre>
    <p>
      Some requests will need an API key to authenticate and authorize the 
      operation. You can find your API key listed in your profile.
    </p>
    <p>
      The API is extensive; rather than replicating the documentation here
      please refer to the official
      <a href="http://docs.pybossa.com/en/latest/api.html">
        PYBOSSA API documentation
      </a> for details. Note that currently only the RESTful API is exposed 
      via the route above (not the PYBOSSA endpoints).
    </p>
  </section>
</template>

<script>
import config from '@/config'

export default {
  data: function () {
    return {
      config: config,
      apiUrl: `${this.$store.state.route.path}/api`
    }
  }
}
</script>

<style>
h3 {
  margin-top: 3rem;
}
</style>
