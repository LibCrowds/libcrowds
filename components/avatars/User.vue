<template>
  <div class="user-avatar mx-auto d-inline" :style="`width: ${size}px;`">
    <base-avatar
      :src="src"
      img-class="img-thumbnail rounded-circle"
      :img-style="style"
      :alt-tag="altTag"
      :tooltip="user.name"
      :tooltip-triggers="tooltipTriggers">
      <v-gravatar
        slot="placeholder"
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
    </base-avatar>
  </div>
</template>

<script>
import localConfig from '@/local.config'
import BaseAvatar from '@/components/avatars/Base'

export default {
  data () {
    return {
      altTag: `Avatar for ${this.user.name}`
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

  components: {
    BaseAvatar
  },

  computed: {
    src () {
      const avatarUrl = this.user.info.avatar_url

      // Will use Gravatar if no custom avatar is available
      if (avatarUrl === undefined || avatarUrl === null) {
        return ''
      }

      // Prepend the pybossa host if a standard upload
      if (avatarUrl.indexOf('/uploads') === 0) {
        return localConfig.pybossaHost + avatarUrl
      }

      return avatarUrl
    },

    style () {
      return `width: ${this.size}px;`
    }
  }
}
</script>
