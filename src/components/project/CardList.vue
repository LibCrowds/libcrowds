<template>
  <div class="project-card-list">

    <transition-group
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

<style>
.shuffle-grid-item {
  transition: all 400ms;
}
</style>
