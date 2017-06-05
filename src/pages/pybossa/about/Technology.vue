<template>
  <section>
    <p>
      {{ pbConfig.title }} is part of the {{ config.brand }} platform, which
      aims to increase access to the collections of the British Library
      through a range of experimental crowdsourcing projects. The platform
      was first launched in June 2015 with the Convert-a-Card project
      series, which used a new method for transforming printed card
      catalogues into electronic
      records.
    </p>
    <p>
      On the backend, each {{ config.brand }} project series uses an
      instance of <a href="http://pybossa.com/" target="_blank">PyBossa</a>,
      an open-source framework for the creation of crowdsourcing projects,
      which in turn is based on the Python microframework, Flask. On the
      frontend, a custom theme has been developed using
      <a href="https://vuejs.org/" target="_blank">Vue.js</a>, a JavaScript
      framework for building user interfaces. A range of plugins have also
      been developed to provide additional functionality, such performing
      database searches via the Z39.50 protocol.
    </p>
    <p>
      The {{ config.brand }} theme, all project templates and plugins are
      available on
      <a :href="config.githubUrl" target="_blank">GitHub</a>.
    </p>
  </section>
</template>

<script>
import config from '@/config'

export default {
  data: function () {
    return {
      config: config,
      pbConfig: config.pybossaSites[ this.$store.state.route.params.sitename ]
    }
  }
}
</script>
