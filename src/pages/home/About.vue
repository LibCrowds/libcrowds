<template>

  <floating-tabs-layout :nav-items="navItems">

    <section>
      <h2 class="text-center">About</h2>
      <hr>
      <span v-if="config.aboutMd" v-html="config.aboutMd"></span>
      <p v-else>
        {{ config.brand }} is a platform for hosting experimental crowdsourcing
        projects from {{ config.company }}. By contributing to the projects
        on this platform you will be directly helping to enable future research.
      </p>
    </section>

    <section :id="navItems[0].id">
      <h3 class="text-center">{{ navItems[0].text }}</h3>
      <span v-if="config.technologyMd" v-html="config.technologyMd"></span>
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

    <section :id="navItems[1].id" v-if="'projectsMd' in config">
      <h3 class="text-center">{{ navItems[1].text }}</h3>
      <hr class="w-50">
      <span v-html="config.projectsMd"></span>
    </section>

    <section :id="navItems[2].id">
      <h3 class="text-center">{{ navItems[2].text }}</h3>
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
import FloatingTabsLayout from '@/components/layouts/FloatingTabs'

export default {
  data: function () {
    return {
      config: config,
      twitterUrl: `https://twitter.com/${config.contact.twitter}`,
      mailto: `mailto:${config.contact.email}`,
      navItems: [
        { id: 'technology', text: 'Technology' },
        { id: 'projects', text: 'Projects' },
        { id: 'contact', text: 'Contact' }
      ]
    }
  },

  metaInfo: {
    title: 'About'
  },

  components: {
    FloatingTabsLayout
  }
}
</script>
