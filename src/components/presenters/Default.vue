<template>
  <div class="default-presenter">
    <span
      v-if="project.info !== undefined"
      v-html="project.info.task_presenter">
    </span>
  </div>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>
.default-presenter {
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 999;
  background-color: #fff;
  width: 100%;
  height: 100%;
  justify-content: center;
}
</style>
