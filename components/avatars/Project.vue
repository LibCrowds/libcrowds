<template>
  <div class="project-avatar">
    <img v-if="avatar" :src="avatar" :class="imgClass">
    <div class="avatar-placeholder">
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
      altTag: `Avatar for ${this.project.name}`,
      avatar: null,
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
     * Load a project avatar.
     * @param {String} avatarUrl
     *   The avatar URL.
     */
    loadAvatar (avatarUrl) {
      if (avatarUrl === undefined || avatarUrl === null) {
        return
      }

      if (avatarUrl.indexOf('/uploads') > -1) {
        this.avatar = localConfig.pybossa.host + avatarUrl
        return
      }
      this.avatar = avatarUrl
    }
  },

  created () {
    this.loadAvatar(this.project.info.thumbnail_url)
  }
}
</script>

<style lang="scss">
@import '~assets/style/settings';

.project-avatar {
  height: 100%;
  width: auto;

  img {
    width: 100%;
    height: auto;
  }

  .avatar-placeholder {
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
