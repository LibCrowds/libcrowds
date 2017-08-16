<template>
  <div id="project-base">
    <div id="project-background" :style="projectBgStyle"></div>
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
      projectConfig: require(
        `../../settings/projects/${this.$route.params.projectname}/config`
      )
    }
  },

  components: {
    ProjectNavbar,
    ProjectFooter
  },

  computed: {
    projectBgStyle: function () {
      const url = this.projectConfig.bgImg
      return {
        background: `url(${url}) no-repeat center left /cover fixed`
      }
    }
  }

  // metaInfo: {
  //   titleTemplate: `%s - ${this.projectConfig.name}`,
  //   bodyAttrs: {
  //     style: `background: url('${this.projectConfig.name}')
  //            no-repeat center center / cover fixed;`
  //   }
  // }
}
</script>

<style lang="scss" scoped>
#project-base {
  #project-background {
    position: fixed;
    top: 0;
    left: 0;
    min-height: 100%;
    height: auto;
    width: 100%;
    min-width: 1024px;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }
}
</style>
