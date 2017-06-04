<template>
  <div id="about">
    <section class="p-3 p-md-5">
      <h1 class="text-uppercase text-center font-weight-bold display-4">
        About {{ siteConfig.title }}
      </h1>
      <hr>
      <span v-html="about"></span>
    </section>
    <section class="p-3 p-md-5">
      <div class="d-flex flex-row align-items-center justify-content-between">
        <h2 class="text-uppercase font-weight-bold display-4">Technology</h2>
        <a href="https://github.com/LibCrowds"
           class="text-muted hidden-md-down"
           target="_blank">
          <icon name="github" scale="5"></icon>
        </a>
      </div>
      <p class="mt-3">
        {{ siteConfig.title }} is part of the LibCrowds platform, which aims to
        increase access to the collections of the British Library through a
        range of experimental crowdsourcing projects. The platform was first
        launched in June 2015 with the Convert-a-Card project series, which used
        a new method for transforming printed card catalogues into electronic
        records.
      </p>
      <p>
        On the backend, each LibCrowds project series uses an instance of
        <a href="http://pybossa.com/" target="_blank">PyBossa</a>, an
        open-source framework for the creation of crowdsourcing projects, which
        in turn is based on the Python microframework, Flask. On the frontend, a
        custom theme has been developed using
        <a href="https://vuejs.org/" target="_blank">Vue.js</a>, a JavaScript
        framework for building user interfaces. A range of plugins have also
        been developed to provide additional functionality, such performing
        database searches via the Z39.50 protocol.
      </p>
      <p>
        The LibCrowds theme, all project templates and plugins are available on
        <a href="https://github.com/LibCrowds" target="_blank">GitHub</a>.
      </p>
    </section>
    <section class="p-3 p-md-5">
      <h3 class="text-uppercase font-weight-bold display-4">
        Contact {{ siteConfig.title }}
      </h3>
      <hr>
      <span v-html="about"></span>
    </section>
  </div>
</template>

<script>
import config from '@/config'
import marked from 'marked'
import 'vue-awesome/icons/github'

export default {
  name: 'about',
  data: function () {
    return {
      siteConfig: config[ this.$store.state.route.params.sitename ]
    }
  },

  computed: {
    about: function () {
      return marked(this.siteConfig.about)
    }
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

section {
  &:nth-child(odd) {
    background-color: $white;
  }

  &:nth-child(even) {
    @extend .bg-faded;
  }
}
</style>
