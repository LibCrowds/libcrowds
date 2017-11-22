<template>
</template>

<script>
import { fetchProjectAndCollection } from '@/mixins/fetchProjectAndCollection'

export default {
  mixins: [ fetchProjectAndCollection ],

  computed: {
    collection () {
      return this.$store.state.currentCollection
    },

    project () {
      return this.$store.state.currentProject
    }
  },

  created () {
    this.$router.push({
      name: 'collection-short_name-projects-id-presenter',
      params: {
        short_name: this.collection.short_name,
        id: this.project.id,
        presenter: this.collection.info.presenter
      }
    })
  }
}
</script>
