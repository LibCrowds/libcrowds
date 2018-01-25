<template>
  <div class="small-avatar">
    <base-avatar
      :src="src"
      img-class="img-fluid rounded-circle"
      alt-tag="Small thumbnail image">
      <div
        slot="placeholder"
        class="img-fluid rounded-circle placeholder">
        <icon name="question"></icon>
      </div>
    </base-avatar>
  </div>
</template>

<script>
import 'vue-awesome/icons/picture-o'
import localConfig from '@/local.config'
import BaseAvatar from '@/components/avatars/Base'

export default {
  props: {
    info: {
      type: Object,
      required: true
    }
  },

  components: {
    BaseAvatar
  },

  computed: {
    src () {
      this.hasError = false
      let url = null
      if (this.info.avatar_url) {
        url = this.info.avatar_url
      } else if (this.info.thumbnail_url) {
        url = this.info.thumbnail_url
      } else if (this.info.media_url) {
        url = this.info.media_url
      }
      if (url && url.startsWith('/uploads')) {
        return localConfig.pybossaHost + url
      } else if (url) {
        return url
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
  max-width: 3rem;
  max-height: 3rem;
  min-width: 3rem;
  min-height: 3rem;

  .base-avatar,
  .placeholder {
    max-width: 3rem;
    max-height: 3rem;
    min-width: 3rem;
    min-height: 3rem;
  }

  .placeholder {
    border: 1px solid $gray-300;
  }
}
</style>
