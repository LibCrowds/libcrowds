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
      projectConfig: require(`@/settings/projects/${this.projectname}/config`)
    }
  },

  props: {
    projectName: {
      type: String,
      required: true
    }
  },

  components: {
    ProjectNavbar
  },

  metaInfo: {
    titleTemplate: `%s - ${projectConfig.name}`,
    bodyAttrs: {
      style: `background: url('${projectConfig.name}')
             no-repeat center center / cover fixed;`
    }
  }
}
</script>

