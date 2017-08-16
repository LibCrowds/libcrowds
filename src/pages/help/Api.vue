<template>
  <floating-tabs-layout>
    <section>
      <h2 class="text-center">API</h2>
      <hr>
      <p>
        {{ siteConfig.brand }} provides a RESTful API that can be used for
        retreiving information about tasks, task runs, results, etc. The API
        expects and returns JSON and is available at:
      </p>
      <pre class="my-2">
        <code>
          {{ siteConfig.pybossaHost }}/api
        </code>
      </pre>
      <p>
        Some requests will need an API key to authenticate and authorize the
        operation. You can find your API key listed in your profile.
      </p>
      <p>
        Rather than replicating the documentation here please refer to the
        official
        <a href="http://docs.pybossa.com/en/latest/api.html">
          PYBOSSA API documentation
        </a>
        for details.
      </p>
    </section>
  </floating-tabs-layout>
</template>

<script>
import siteConfig from '@/settings/siteConfig'
import FloatingTabsLayout from '@/components/layouts/FloatingTabs'

export default {
  data: function () {
    return {
      siteConfig: siteConfig
    }
  },

  metaInfo: {
    title: 'API'
  },

  components: {
    FloatingTabsLayout
  }
}
</script>

<style>
h3 {
  margin-top: 3rem;
}
</style>
