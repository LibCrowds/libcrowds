<template>
  <b-tooltip :content="user.name" :triggers="tooltipTriggers">
    <div id="wrapper">
      <img
        v-if="showPlaceholder"
        :src="src"
        :alt="alt"
        class="img-thumbnail rounded-circle"
        :onerror="imgError = true">
      <v-gravatar
        v-else
        :email="user.name"
        default-img="identicon"
        :alt="alt"
        class="img-thumbnail rounded-circle">
      </v-gravatar>
    </div>
  </b-tooltip>
</template>

<script>
import config from '@/config'

export default {
  data () {
    return {
      imgError: false
    }
  },

  computed: {
    showPlaceholder () {
      return !this.imgError && 'avatar' in this.user.info
    },
    src () {
      const file = `${this.user.info.container}/${this.user.info.avatar}`
      if (config.uploadMethod === 'local') {
        return `${config.pybossaHost}/uploads/${file}`
      } else if (config.uploadMethod === 'rackspace') {
        // TODO: Add rackspace URL
      }
    },
    alt () { return `User avatar for ${this.user.name}` }
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
  }
}
</script>

<style scoped>
img {
  width: 100%;
  height: auto;
}
</style>
