<template>

  <floating-tabs-layout :nav-items="navItems">

    <section id="projects">
      <h2 class="text-center">Projects</h2>
      <hr>
      <span v-html="categorisation"></span>
    </section>

    <section id="contribute">
      <h3 class="text-center">Contribute</h3>
      <project-contrib-table></project-contrib-table>
    </section>

  </floating-tabs-layout>

</template>

<script>
import marked from 'marked'
import ProjectContribTable from '@/components/tables/ProjectContrib'
import FloatingTabsLayout from '@/components/layouts/FloatingTabs'

export default {
  data: function () {
    return {
      navItems: [
        { id: 'projects', text: 'Top' },
        { id: 'contribute', text: 'Contribute' }
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
    categorisation: function () {
      return marked(this.siteConfig.categorisation)
    }
  }
}
</script>
