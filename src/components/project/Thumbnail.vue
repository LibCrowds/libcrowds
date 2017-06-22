<template>
  <img
    v-if="showPlaceholder"
    :src="src"
    :alt="alt"
    class="img-responsive"
    onerror="imgError = true">
  </img>
  <v-gravatar
    v-else
    :email="project.short_name"
    default-img="retro"
    :alt="alt"
    class="img-responsive">
  </v-gravatar>
</template>

<script>
export default {
  data () {
    return {
      imgError: false
    }
  },

  computed: {
    showPlaceholder () {
      return this.imgError || !('thumbnail' in this.project.info)
    },
    src () {
      // TODO: Figure out how to determine PyBossa upload folder
    },
    alt () { return `Project thumbnail for ${this.project.name}` }
  },

  props: {
    project: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
img {
  width: 100%;
  height: auto;
}
</style>
