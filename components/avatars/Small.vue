<template>
  <div class="small-avatar">
    <img
      v-if="src && !hasError"
      :src="src"
      class="img-fluid rounded-circle"
      :onerror="hasError = true">
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
      hasError: false
    }
  },

  props: {
    info: {
      type: Object,
      required: true
    }
  },

  computed: {
    src () {
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
  },

  watch: {
    domainObject () {
      this.hasError = false
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

  &>* {
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
