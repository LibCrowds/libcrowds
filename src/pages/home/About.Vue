<template>

  <floating-tabs-layout :nav-items="navItems">

    <section id="about">
      <h2 class="text-center">About</h2>
      <hr>
      <span v-if="aboutMd" v-html="aboutMd"></span>
      <p v-else>
        {{ config.brand }} is a platform for hosting experimental crowdsourcing
        projects from {{ config.company }}. By contributing to the projects
        on this platform you will be directly helping to enable future research.
      </p>
    </section>

    <section id="technology">
      <h3>Technology</h3>
      <span v-if="technologyMd" v-html="technologyMd"></span>
      <p v-else>
        On the backend, {{ config.brand }} uses an instance of
        <a href="http://pybossa.com/" target="_blank">PyBossa</a>,
        an open-source framework for the creation of crowdsourcing projects,
        which in turn is based on the Python microframework, Flask. On the
        frontend, a custom theme has been developed using
        <a href="https://vuejs.org/" target="_blank">Vue.js</a>, a JavaScript
        framework for building user interfaces.
      </p>
    </section>

    <section id="contact">
      <h3>Contact</h3>
      <p v-if="config.forumUrl">
        Visit the <a :href="config.forumUrl">{{ config.brand }} forum</a>
        to ask any questions, report issues, or to just let us know what
        you have discovered.
      </p>
      <ul class="list-unstyled">
        <li>
          <strong>Twitter: </strong>
          <a :href="twitterUrl">
            @{{ config.contact.twitter }}
          </a>
        </li>
        <li>
          <strong>Email: </strong>
          <a :href="mailto">
            {{ config.contact.email }}
          </a>
        </li>
      </ul>

    </section>

  </floating-tabs-layout>

</template>

<script>
import config from '@/config'
import marked from 'marked'
import FloatingTabsLayout from '@/components/layouts/FloatingTabs'

export default {
  data: function () {
    return {
      config: config,
      twitterUrl: `https://twitter.com/${config.contact.twitter}`,
      mailto: `mailto:${config.contact.email}`,
      navItems: [
        { id: 'about', text: 'Top' },
        { id: 'technology', text: 'Technology' },
        { id: 'contact', text: 'Contact' }
      ]
    }
  },

  metaInfo: {
    title: 'About'
  },

  components: {
    FloatingTabsLayout
  },

  computed: {
    aboutMd: function () {
      console.log(marked(this.config.aboutMd))
      if ('aboutMd' in this.config) {
        return marked(this.config.aboutMd)
      }
      return ''
    },
    technologyMd: function () {
      if ('technologyMd' in this.config) {
        return marked(this.config.technologyMd)
      }
      return ''
    }
  }
}
</script>
