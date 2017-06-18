<template>

  <floating-tabs-layout :nav-items="navItems">

    <section id="projects">
      <h2 class="text-center">Projects</h2>
      <hr>
      <span v-html="config.projectsMd" v-if="this.projectsMd"></span>
      <p v-else>
        Each {{ config.brand }} project comprises a collection of similar tasks.
        With each completed task you will be directly contributing towards
        important research. Choose a project from the list below to get started!
      </p>
    </section>

    <section id="choose">
      <h3 class="text-center">Choose a Project</h3>
      <project-contrib-table></project-contrib-table>
    </section>

  </floating-tabs-layout>

</template>

<script>
import marked from 'marked'
import config from '@/config'
import ProjectContribTable from '@/components/tables/ProjectContrib'
import FloatingTabsLayout from '@/components/layouts/FloatingTabs'

export default {
  data: function () {
    return {
      config: config,
      navItems: [
        { id: 'projects', text: 'Top' },
        { id: 'choose', text: 'Choose a Project' }
      ]
    }
  },

  components: {
    FloatingTabsLayout,
    ProjectContribTable
  },

  metaInfo: {
    title: 'Projects'
  },

  computed: {
    projectsMd: function () {
      if ('projectsMd' in this.config) {
        return marked(this.config.projectsMd)
      }
      return ''
    }
  }
}
</script>
