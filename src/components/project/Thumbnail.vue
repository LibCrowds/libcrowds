<template>
  <div class="project-thumbnail" :data-type="chosenType">

    <v-gravatar
      v-if="thumbnail === 'gravatar'"
      :email="project.short_name"
      :size="200"
      default-img="identicon"
      :class="imgClass"
      :alt="altTag">
    </v-gravatar>

    <img v-else :src="thumbnail" :class="imgClass" :alt="altTag">

  </div>
</template>

<script>
import siteConfig from '@/siteConfig'

export default {
  data: function () {
    return {
      altTag: `Thumbnail for ${this.project.name}`,
      thumbnail: null,
      chosenType: null,
      imgClass: `hoizontal-${this.horizontalBreakpoint}-up`
    }
  },

  props: {
    project: {
      type: Object,
      required: true
    }
  },

  methods: {
    /**
     * Load a thumbnail.
     */
    loadThumbnail () {
      const custom = this.project.info.thumbnail_url

      // Use Gravatar if no custom thumbnail is available
      if (custom === undefined || custom === null) {
        this.thumbnail = 'gravatar'
        return
      }

      if (custom.indexOf('/uploads') > -1) {
        this.thumbnail = siteConfig.pybossaHost + custom
        return
      }
      this.thumbnail = custom
    }
  },

  created () {
    this.loadThumbnail()
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/main';

.project-thumbnail {
  height: 100%;
  width: auto;

  img {
    width: 100%;
    height: auto;
  }
}
</style>
