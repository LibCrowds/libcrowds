<template>
  <div id="about">
    <sub-navbar :items="subnavItems"></sub-navbar>
    <section id="background" class="p-3 p-md-5">
      <h1 class="text-uppercase text-center font-weight-bold display-4">
        Background
      </h1>
      <hr>
      <span v-html="about"></span>
    </section>
    <section id="technology" class="p-3 p-md-5">
      <div class="d-flex flex-row align-items-center justify-content-between">
        <h2 class="text-uppercase font-weight-bold display-4">Technology</h2>
        <a :href="config.githubUrl"
           class="text-muted hidden-md-down"
           target="_blank">
          <icon name="github" scale="5"></icon>
        </a>
      </div>
      <p class="mt-3">
        {{ pbConfig.title }} is part of the {{ config.brand }} platform, which
        aims to increase access to the collections of the British Library through
        a range of experimental crowdsourcing projects. The platform was first
        launched in June 2015 with the Convert-a-Card project series, which used
        a new method for transforming printed card catalogues into electronic
        records.
      </p>
      <p>
        On the backend, each {{ config.brand }} project series uses an instance
        of <a href="http://pybossa.com/" target="_blank">PyBossa</a>, an
        open-source framework for the creation of crowdsourcing projects, which
        in turn is based on the Python microframework, Flask. On the frontend, a
        custom theme has been developed using
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
    <section id="contact" class="p-3 p-md-5">
      <h3 class="text-uppercase font-weight-bold display-4">
        Contact
      </h3>
      <hr>
      <p>
        Visit the <a :href="config.discourseUrl">{{ config.brand }} forum</a>
        to ask any questions, report issues, or to just let us know what you've
        discovered.
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
    </section>
  </div>
</template>

<script>
import config from '@/config'
import marked from 'marked'
import SubNavbar from '@/components/SubNavbar'
import 'vue-awesome/icons/github'

export default {
  name: 'about',
  data: function () {
    return {
      config: config,
      pbConfig: config.pybossaSites[ this.$store.state.route.params.sitename ],
      subnavItems: [
        { value: 'Background', href: '#background' },
        { value: 'Technology', href: '#technology' },
        { value: 'Contact', href: '#contact' }
      ]
    }
  },

  components: {
    SubNavbar
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

section {
  &:nth-child(odd) {
    background-color: $white;
  }

  &:nth-child(even) {
    @extend .bg-faded;
  }
}
</style>
