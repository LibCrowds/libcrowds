<template>
  <div class="project-card-list">
    <transition-group appear
      ref="shuffle-grid"
      tag="ul"
      class="list-unstyled">
      <li class="shuffle-grid-item"
        v-for="project in projects"
        :key="project.short_name">
        <project-card
          :collection="collection"
          :project="project">
        </project-card>
      </li>
    </transition-group>
  </div>
</template>

<script>
import ProjectCard from '@/components/cards/Project'

export default {
  props: {
    projects: {
      type: Array,
      required: true
    },
    collection: {
      type: Object,
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
