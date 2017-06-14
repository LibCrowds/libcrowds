<template>

  <floating-tabs :nav-items="floatingTabNavItems">

    <section id="projects">
      <h2 class="text-center">Projects</h2>
      <hr>
      <span v-html="categorisation"></span>
    </section>

    <section id="contribute">
      <h3 class="text-center">Contribute</h3>
      <project-contrib-table></project-contrib-table>
    </section>

  </floating-tabs>

</template>

<script>
import marked from 'marked'
import ProjectContribTable from '@/components/tables/ProjectContribTable'
import FloatingTabs from '@/components/layouts/FloatingTabs'

export default {
  data: function () {
    return {
      siteConfig: this.$store.state.siteConfig,
      floatingTabNavItems: [
        { id: 'projects', text: 'Top' },
        { id: 'contribute', text: 'Contribute' }
      ]
    }
  },

  components: {
    FloatingTabs,
    ProjectContribTable
  },

  computed: {
    categorisation: function () {
      return marked(this.siteConfig.categorisation)
    }
  }
}
</script>
