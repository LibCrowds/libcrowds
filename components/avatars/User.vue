<template>
  <div class="user-avatar mx-auto d-inline" :style="`width: ${size}px;`">

    <v-gravatar
      v-if="avatar === 'gravatar'"
      v-b-tooltip
      :triggers="tooltipTriggers"
      :title="user.name"
      :email="user.name"
      :size="size"
      default-img="identicon"
      :alt="altTag"
      :style="style"
      class="img-thumbnail rounded-circle">
    </v-gravatar>

    <img
      v-else
      v-b-tooltip
      :triggers="tooltipTriggers"
      :title="user.name"
      :src="avatar"
      :style="style"
      class="img-thumbnail rounded-circle">

  </div>
</template>

<script>
import localConfig from '@/local.config'

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

  computed: {
    style () {
      return {
        width: `${this.size}px`
      }
    }
  },

  methods: {
    /**
     * Load an avatar.
     * @param {String} avatarUrl
     *   The avatar URL.
     */
    loadAvatar (avatarUrl) {
      // Use Gravatar if no custom avatar is available
      if (avatarUrl === undefined || avatarUrl === null) {
        this.avatar = 'gravatar'
        return
      }

      // Prepend the pybossa host if a standard upload
      if (avatarUrl.indexOf('/uploads') > -1) {
        this.avatar = localConfig.pybossa.host + avatarUrl
        return
      }
      this.avatar = avatarUrl
    }
  },

  created () {
    this.loadAvatar(this.user.info.avatar_url)
  }
}
</script>
