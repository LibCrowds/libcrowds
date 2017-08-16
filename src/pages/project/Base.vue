<template>
  <div id="project-base">
    <main>
      <router-view :projectConfig="projectConfig"></router-view>
    </main>
  </div>
</template>

<script>

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

  metaInfo: {
    titleTemplate: `%s - ${projectConfig.name}`,
    bodyAttrs: {
      style: `background: url('${projectConfig.name}')
             no-repeat center center / cover fixed;`
    }
  }
}
</script>

