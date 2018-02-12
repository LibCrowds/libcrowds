<template>
  <div :class="classObj">
    <base-avatar
      :src="src"
      img-class="img-fluid rounded-circle"
      alt-tag="Small thumbnail image">
      <div
        slot="placeholder"
        :class="placeholderClassObj">
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
    },
    extraSmall: {
      type: Boolean,
      default: false
    }
  },

  components: {
    BaseAvatar
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
      return ''
    },

    classObj () {
      return {
        'small-avatar': true,
        'xs': this.extraSmall
      }
    },

    placeholderClassObj () {
      return {
        'img-fluid': true,
        'rounded-circle': true,
        'placeholder': true,
        'placeholder-dark': this.darkMode
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

  .base-avatar,
  .placeholder {
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

    .placeholder {
      width: 2rem;
      height: 2rem;
      max-width: 2rem;
      max-height: 2rem;
    }
  }

  .placeholder {
    border: 1px solid $gray-300;

    &.placeholder-dark {
      border-color: $gray-600;
    }
  }
}
</style>
