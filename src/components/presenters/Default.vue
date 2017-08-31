<template>
  <div class="default-presenter invert-navbar">
    <span
      v-if="project.info !== undefined"
      v-html="project.info.task_presenter">
    </span>
  </div>
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

<style>
.default-presenter {
  padding-top: 120px;
  overflow: auto;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  background-color: #fff;
  width: 100%;
  height: 100%;
}
</style>
