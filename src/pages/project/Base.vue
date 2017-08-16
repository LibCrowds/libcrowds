<template>
  <div id="project-base">
    <app-navbar
      :sticky="'top'"
      :fixed="null">
    </app-navbar>
    <main>
      <router-view :projectConfig="projectConfig"></router-view>
    </main>
  </div>
</template>

<script>
import ProjectNavbar from '@/components/navbars/ProjectNavbar'

export default {
  data: function () {
    return {
      projectConfig: require(`@/settings/projects/${this.$route.params.projectname}/config`)
    }
  },

  components: {
    ProjectNavbar
  },

  metaInfo: {
    titleTemplate: `%s - ${this.projectConfig.name}`,
    bodyAttrs: {
      style: `background: url('${this.projectConfig.name}')
             no-repeat center center / cover fixed;`
    }
  },

  mounted () {
    console.log(this.projectConfig)
  }
}
</script>
