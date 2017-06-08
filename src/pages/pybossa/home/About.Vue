<template>

  <floating-tabs>

    <b-nav slot="nav">
      <b-nav-item href="#background">Background</b-nav-item>
      <b-nav-item href="#technology">Technology</b-nav-item>
      <b-nav-item href="#contact">Contact</b-nav-item>
      <b-nav-item href="#background">Background</b-nav-item>
      <b-nav-item href="#technology">Technology</b-nav-item>
      <b-nav-item href="#contact">Contact</b-nav-item>
    </b-nav>

    <section id="background">
      <h2 class="text-center">Background</h2>
      <hr>
      <span v-html="background"></span>
    </section>

    <section id="technology">
      <h3>Technology</h3>
      <p>
        {{ siteConfig.name }} is part of the {{ config.brand }} platform,
        which aims to increase access to the collections of the British Library
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

    <section id="contact">
      <h3>Contact</h3>
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
    </section>

  </floating-tabs>

</template>

<script id="#contact">
import marked from 'marked'
import config from '@/config'
import FloatingTabs from '@/components/layouts/FloatingTabs'

export default {
  data: function () {
    return {
      config: config,
      siteConfig: this.$store.state.siteConfig
    }
  },

  components: {
    FloatingTabs
  },

  computed: {
    background: function () {
      return marked(this.siteConfig.background)
    }
  }
}
</script>
