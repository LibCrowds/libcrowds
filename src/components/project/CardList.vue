<template>
  <div class="project-card-list">

    <transition-group appear
      ref="shuffle-grid"
      tag="ul"
      class="list-unstyled">
      <li class="shuffle-grid-item"
        v-for="p in projects"
        :key="p.short_name">
        <project-card :project="p"></project-card>
      </li>
    </transition-group>

  </div>
</template>

<script>
import ProjectCard from '@/components/project/Card'

export default {
  props: {
    projects: {
      type: Array,
      required: true
    }
  },

  components: {
    ProjectCard
  }
}
</script>

<style lang="scss">
.project-card-list {
  .shuffle-grid-item {
    transition: all 500ms ease;
  }

  .v-enter,
  .v-leave-to {
    -webkit-transform: translateY(20px);
    transform: translateY(20px);
    opacity: 0;
  }
}
</style>
