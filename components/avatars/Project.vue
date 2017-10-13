<template>
  <div class="project-thumbnail">
    <img v-if="thumbnail" :src="thumbnail" :class="imgClass">
    <div class="thumbnail-placeholder">
      <icon name="picture-o" scale="4"></icon>
    </div>
  </div>
</template>

<script>
import localConfig from '@/local.config'
import 'vue-awesome/icons/picture-o'

export default {
  data: function () {
    return {
      altTag: `Thumbnail for ${this.project.name}`,
      thumbnail: null,
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

      if (custom === undefined || custom === null) {
        return
      }

      if (custom.indexOf('/uploads') > -1) {
        this.thumbnail = localConfig.pybossa.host + custom
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

  .thumbnail-placeholder {
    @extend .bg-light;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      color: $gray-600;
    }
  }
}
</style>
