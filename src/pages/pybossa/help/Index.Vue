<template>
  <div id="about">
    <transition name="fade">
    <b-tabs pills>
        <b-tab title="Background" class="p-3 p-md-5">
          <h2 class="text-uppercase text-center font-weight-bold display-4">
            Backgrounds
          </h2>
          <hr>
          <span v-html="about"></span>
        </b-tab>
      <b-tab title="Technology" class="p-3 p-md-5">
        <h3 class="text-uppercase text-center font-weight-bold display-4">
          Technology
        </h3>
        <hr>
        <p class="mt-3">
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
      </b-tab>
      <b-tab title="Contact" class="p-3 p-md-5">
        <h3 class="text-uppercase text-center font-weight-bold display-4">
          Contact
        </h3>
        <hr>
        <p>
          Visit the <a :href="config.discourseUrl">{{ config.brand }} forum</a>
          to ask any questions, report issues, or to just let us know what
          you've discovered.
        </p>
        <p>
          Alternatively, you can get in touch via:
        </p>
        <ul class="list-unstyled">
          <li>
            <strong>Twitter: </strong>
            <a :href="'https://twitter.com/' + config.contact.twitter">
              @{{ config.contact.twitter }}
            </a>
          </li>
          <li>
            <strong>Email: </strong>
            <a :href="'mailto:' + config.contact.email">
              {{ config.contact.email }}
            </a>
          </li>
        </ul>
      </b-tab>
    </b-tabs>
    </transition>
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
      config: config,
      pbConfig: config.pybossaSites[ this.$store.state.route.params.sitename ]
    }
  },

  computed: {
    about: function () {
      return marked(this.pbConfig.about)
    }
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}
</style>
