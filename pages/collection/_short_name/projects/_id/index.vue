<template>
</template>

<script>
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'

export default {
  mixins: [ fetchCollectionByName ],

  computed: {
    collection () {
      return this.$store.state.currentCollection
    }
  },

  beforeCreate () {
    const projectId = this.$route.params.id
    return this.$axios.$get(`/api/project/${projectId}`).then(project => {
      this.$router.push({
        name: 'collection-short_name-projects-id-presenter',
        params: {
          short_name: this.collection.short_name,
          id: project.id,
          presenter: this.collection.info.presenter
        }
      })
    }).catch(err => {
      this.$nuxt.error(err)
    })
  }
}
</script>
