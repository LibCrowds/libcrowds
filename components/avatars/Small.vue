<template>
  <div :class="classObj">
    <img
      v-if="src"
      :src="src"
      class="img-fluid rounded-circle"
      :onerror="hasError = true">
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
    },
    extraSmall: {
      type: Boolean,
      default: false
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
    },

    classObj () {
      return {
        'small-avatar': true,
        'xs': this.extraSmall
      }
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
  width: 3rem;
  height: 3rem;
  max-width: 3rem;
  max-height: 3rem;

  &>* {
    width: 3rem;
    height: 3rem;
    max-width: 3rem;
    max-height: 3rem;
  }

  &.xs {
    width: 2rem;
    height: 2rem;
    max-width: 2rem;
    max-height: 2rem;

    &>* {
      width: 2rem;
      height: 2rem;
      max-width: 2rem;
      max-height: 2rem;
    }
  }

  .placeholder {
    border: 1px solid $gray-300;
  }
}
</style>
