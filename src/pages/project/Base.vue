<template>
  <div id="project-base">
    <project-navbar
      :projectConfig="projectConfig"
      :sticky="true"
      :fixed="null">
    </project-navbar>
    <main>
      <router-view
        :projectConfig="projectConfig">
      </router-view>
    </main>
    <project-footer
      :projectConfig="projectConfig">
    </project-footer>
  </div>
</template>

<script>
import ProjectNavbar from '@/components/navbars/ProjectNavbar'
import ProjectFooter from '@/components/footers/ProjectFooter'

export default {
  data: function () {
    return {
      projectConfig: require(`../../settings/projects/${this.$route.params.projectname}/config`)
    }
  },

  components: {
    ProjectNavbar,
    ProjectFooter
  },

  // metaInfo: {
  //   titleTemplate: `%s - ${this.projectConfig.name}`,
  //   bodyAttrs: {
  //     style: `background: url('${this.projectConfig.name}')
  //            no-repeat center center / cover fixed;`
  //   }
  // },

  mounted () {
    console.log(this.projectConfig)
  }
}
</script>
