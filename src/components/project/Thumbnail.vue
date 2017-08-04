<template>
  <div class="project-thumbnail">

    <img
      v-if="customThumbnail"
      :src="customThumbnail"
      :alt="altTag"
      class="img-responsive">
    </img>

    <v-gravatar
      v-else
      :email="project.short_name"
      default-img="retro"
      :alt="altTag"
      class="img-responsive">
    </v-gravatar>


  </div>
</template>

<script>
import config from '@/config'

export default {
  data () {
    return {
      imgError: false,
      altTag: `Thumbnail for ${this.project.name}`
    }
  },

  props: {
    project: {
      type: Object,
      required: true
    }
  },

  computed: {
    customThumbnail: function () {
      const hasCustom = (
        'thumbnail_url' in this.project.info &&
        this.project.info.thumbnail_url !== null
      )

      if (!hasCustom) {
        return null
      }

      if (this.project.info.thumbnail_url.startsWith('/uploads')) {
        return config.pybossaHost + this.project.info.thumbnail_url
      }
      return this.project.info.thumbnail_url
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
