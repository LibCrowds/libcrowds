<template>
  <div class="small-avatar">
    <img
      v-if="src"
      :src="src"
      size
      class="img-fluid rounded-circle"
      :onerror="info = null">
    </img>
    <div
      v-else
      class="img-fluid rounded-circle placeholder">
      <icon name="question"></icon>
    </div>
  </div>
</template>

<script>
import localConfig from '@/local.config'
import 'vue-awesome/icons/picture-o'

export default {
  data () {
    return {
      info: this.domainObject.info
    }
  },

  props: {
    domainObject: {
      type: Object,
      required: true
    }
  },

  computed: {
    src () {
      const host = localConfig.pybossa.host
      if (!this.info) {
        return null
      } else if (this.info.avatar_url) {
        return host + this.info.avatar_url
      } else if (this.info.thumbnail_url) {
        return host + this.info.thumbnail_url
      } else if (this.info.media_url) {
        return host + this.info.media_url
      }
      return null
    }
  }
}
</script>

<style lang="scss">
@import '~assets/style/settings';

.small-avatar {
  overflow: hidden;
  width: 3rem;
  height: 3rem;

  img {
    width: 3rem;
    height: 3rem;
  }

  .placeholder {
    border: 1px solid $gray-300;
  }
}
</style>
