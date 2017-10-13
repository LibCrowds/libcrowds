<template>
  <div class="user-avatar">

    <v-gravatar
      v-if="avatar === 'gravatar'"
      v-b-tooltip
      :triggers="tooltipTriggers"
      :title="user.name"
      :email="user.name"
      :size="size"
      default-img="identicon"
      :alt="altTag"
      class="img-thumbnail rounded-circle">
    </v-gravatar>

    <img
      v-else
      v-b-tooltip
      :triggers="tooltipTriggers"
      :title="user.name"
      :src="avatar">

  </div>
</template>

<script>
import siteConfig from '~/local.config'

export default {
  data () {
    return {
      altTag: `Avatar for ${this.user.name}`,
      avatar: null
    }
  },

  props: {
    user: {
      type: Object,
      required: true
    },
    tooltipTriggers: {
      type: [Boolean, String, Array],
      default: () => []
    },
    size: {
      type: Number,
      default: 80
    }
  },

  methods: {
    /**
     * Load an avatar.
     */
    loadAvatar () {
      const custom = this.user.info.avatar_url

      // Use Gravatar if no custom avatar is available
      if (custom === undefined || custom === null) {
        this.avatar = 'gravatar'
        return
      }

      if (custom.indexOf('/uploads') > -1) {
        this.avatar = siteConfig.pybossaHost + custom
        return
      }
      this.avatar = custom
    }
  },

  created () {
    this.loadAvatar()
  }
}
</script>

<style lang="scss" scoped>
.user-avatar {
  img {
    width: 100%;
    height: auto;
  }
}
</style>
