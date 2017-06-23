<template>
  <img
    v-if="showPlaceholder"
    :src="src"
    :alt="alt"
    class="img-responsive"
    :onerror="imgError = true">
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
      const file = `${this.user.info.container}/${this.user.info.avatar}`
      if (config.uploadMethod === 'local') {
        return `${config.pybossaHost}/uploads/${file}`
      } else if (config.uploadMethod === 'rackspace') {
        // TODO: Add rackspace URL
      }
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
