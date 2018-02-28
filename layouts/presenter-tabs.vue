<template>
  <tabs-base
    :navbar-brand="currentCollection.name"
    :background-image-url="backgroundImageUrl">
    <nuxt></nuxt>

    <template slot="right">
      <b-btn
        size="sm"
        :variant="darkMode ? 'dark' : 'secondary'"
        v-b-modal="tutorialModalId">
        Help
      </b-btn>

      <!-- Tutorial modal -->
      <b-modal
        show
        lazy
        :id="tutorialModalId"
        title="Tutorial"
        size="lg"
        ok-only
        :header-text-variant="darkMode ? 'white' : null"
        :header-bg-variant="darkMode ? 'dark' : null"
        :body-bg-variant="darkMode ? 'dark' : null"
        :body-text-variant="darkMode ? 'white' : null"
        :footer-bg-variant="darkMode ? 'dark' : null"
        :footer-text-variant="darkMode ? 'white' : null">
        <b-container
          class="py-2 px-3"
          v-html="projectTutorial">
        </b-container>
      </b-modal>
    </template>

  </tabs-base>
</template>

<script>
import marked from 'marked'
import TabsBase from '@/layouts/bases/Tabs'

export default {
  data () {
    return {
      tutorialModalId: 'tutorial-modal'
    }
  },

  components: {
    TabsBase
  },

  computed: {
    currentCollection () {
      return this.$store.state.currentCollection
    },

    currentProject () {
      return this.$store.state.currentProject
    },

    projectTemplate () {
      const template = this.currentCollection.info.templates.find(tmpl => {
        return tmpl.id === this.currentProject.info.template_id
      })
      if (typeof template === 'undefined') {
        return {}
      }
      return template
    },

    projectTutorial () {
      console.log('getting project tutorial')
      const help = this.projectTemplate.tutorial || ''
      console.log(this.projectTemplate, marked(help))
      return marked(help)
    },

    backgroundImageUrl () {
      if (this.currentCollection.info.background) {
        return this.currentCollection.info.background
      }
      return '~/assets/img/app-background.jpg'
    }
  }
}
</script>
