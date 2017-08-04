<template>
  <b-tooltip :content="user.name" :triggers="tooltipTriggers">
    <div id="wrapper">

      <v-gravatar
        v-if="chosenType === 'gravatar'"
        :email="user.name"
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
import config from '@/config'

export default {
  data () {
    return {
      altTag: `Thumbnail for ${this.user.name}`,
      preference: JSON.parse(JSON.stringify(config.avatarPreference)),
      avatar: null,
      chosenType: null
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

      if (custom.startsWith('/uploads')) {
        this.avatar = config.pybossaHost + custom
        return
      }
      this.avatar = custom
    },

    /**
     * Attempt to load the avatar of the next type.
     */
    loadNext () {
      const type = this.preference.shift()
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
