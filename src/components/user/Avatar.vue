<template>
  <b-tooltip :content="user.name" :triggers="tooltipTriggers">
    <div id="wrapper">

      <v-gravatar
        v-if="chosenType === 'gravatar'"
        :email="user.name"
        :size="size"
        default-img="identicon"
        :alt="altTag"
        class="img-thumbnail rounded-circle">
      </v-gravatar>

      <img
        v-else
        :src="avatar"
        :alt="altTag">

    </div>
  </b-tooltip>
</template>

<script>
import siteConfig from '@/settings/siteConfig'

export default {
  data () {
    return {
      altTag: `Thumbnail for ${this.user.name}`,
      avatarPreferences: JSON.parse(JSON.stringify(this.preferences)),
      avatar: null,
      chosenType: null
    }
  },

  props: {
    preferences: {
      type: Array,
      required: true
    },
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
     * Set a custom avatar.
     */
    setCustomAvatar () {
      const custom = this.user.info.avatar_url

      if (custom === undefined || custom === null) {
        this.loadNext()
        return
      }

      if (custom.indexOf('/uploads') > -1) {
        this.avatar = siteConfig.pybossaHost + custom
        return
      }
      this.avatar = custom
    },

    /**
     * Attempt to load the avatar of the next type.
     */
    loadNext () {
      const type = this.avatarPreferences.shift()
      this.chosenType = type
      if (type === 'custom') {
        this.setCustomAvatar()
      }
    }
  },

  created () {
    this.loadNext()
  }
}
</script>

<style scoped>
img {
  width: 100%;
  height: auto;
}
</style>
