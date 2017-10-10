<template>
  <section
    id="default-presenter"
    v-if="project.info !== undefined"
    v-html="project.info.task_presenter">
  </section>
</template>

<script>
import stripAndExecuteScripts from '@/utils/stripAndExecuteScripts'

export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },

  mounted () {
    stripAndExecuteScripts(this.project.info.task_presenter)
  }
}
</script>
