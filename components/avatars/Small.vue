<template>
  <div class="small-avatar">
    <img
      v-if="src"
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
    domainObject: {
      type: Object,
      required: true
    }
  },

  computed: {
    src () {
      const host = localConfig.pybossaHost
      if (!this.domainObject.info) {
        return null
      } else if (this.domainObject.info.avatar_url) {
        return host + this.domainObject.info.avatar_url
      } else if (this.domainObject.info.thumbnail_url) {
        return host + this.domainObject.info.thumbnail_url
      } else if (this.domainObject.info.media_url) {
        return host + this.domainObject.info.media_url
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
