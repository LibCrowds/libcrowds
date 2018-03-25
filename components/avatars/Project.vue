<template>
  <div class="project-avatar">
    <base-avatar
      :src="src"
      :img-class="imgClass"
      :alt-tag="altTag">
      <div
        slot="placeholder"
        :class="darkMode ? 'placeholder placeholder-dark' : 'placeholder'">
        <icon name="picture-o" scale="4"></icon>
      </div>
    </base-avatar>
  </div>
</template>

<script>
import 'vue-awesome/icons/picture-o'
import localConfig from '@/local.config'
import BaseAvatar from '@/components/avatars/Base'

export default {
  data () {
    return {
      altTag: `Avatar for ${this.project.name}`,
      imgClass: `hoizontal-${this.horizontalBreakpoint}-up`
    }
  },

  props: {
    project: {
      type: Object,
      required: true
    }
  },

  components: {
    BaseAvatar
  },

  computed: {
    src () {
      const thumbnailUrl = this.project.info.thumbnail_url

      if (thumbnailUrl === undefined || thumbnailUrl === null) {
        return ''
      }

      if (thumbnailUrl.startsWith('/uploads')) {
        return localConfig.pybossaHost + thumbnailUrl
      }
      return thumbnailUrl
    }
  }
}
</script>

<style lang="scss">
@import '~assets/style/settings';

.project-avatar {
  height: 100%;
  width: auto;

  .base-avatar {
    height: 100%;
    width: auto;

    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>
