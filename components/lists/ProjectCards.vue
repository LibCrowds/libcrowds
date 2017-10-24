<template>
  <div class="project-card-list">
    <transition-group appear
      ref="shuffle-grid"
      tag="ul"
      class="list-unstyled">
      <li class="shuffle-grid-item"
        v-for="project in projects"
        :key="project.id">
        <project-card
          :collection="collection"
          :project="project">
        </project-card>
      </li>
    </transition-group>
    <infinite-loading
      @infinite="infinitelyLoadProjects">
       <span slot="no-results"></span>
       <span slot="no-more">
         No more results
       </span>
    </infinite-loading>
  </div>
</template>

<script>
import ProjectCard from '@/components/cards/Project'
import { infinitelyLoadProjects } from '@/mixins/infinitelyLoadProjects'

export default {
  mixins: [ infinitelyLoadProjects ],

  computed: {
    collection () {
      return this.$store.state.collection
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
