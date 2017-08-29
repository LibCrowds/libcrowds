<template>
  <div class="default-presenter">
    <span
      v-if="project"
      v-html="project.taskpresenter">
      YAH
    </span>
    NAH
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      project: null
    }
  }
}
</script>

<style>
.libcrowds-viewer-presenter {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 9999999;
  background-color: #000;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
