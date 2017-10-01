<template>
  <div class="oauth-buttons">

    <div v-if="facebook">
      <b-btn
        class="mx-1"
        variant="facebook"
        @click="redirect('facebook')">
        <icon name="facebook"></icon>
        <span class="ml-1 d-none d-sm-block">Facebook</span>
      </b-btn>
    </div>

    <div v-if="google">
      <b-btn
        class="mx-1"
        variant="googleplus"
        @click="redirect('google')">
        <icon name="google"></icon>
        <span class="ml-1 d-none d-sm-block">Google</span>
      </b-btn>
    </div>

    <div v-if="twitter">
      <b-btn
        class="mx-1"
        variant="twitter"
        @click="redirect('twitter')">
        <icon name="twitter"></icon>
        <span class="ml-1 d-none d-sm-block">Twitter</span>
      </b-btn>
    </div>

  </div>
</template>

<script>
import siteConfig from '@/siteConfig'

export default {
  props: {
    facebook: {
      type: Boolean,
      default: false
    },
    google: {
      type: Boolean,
      default: false
    },
    twitter: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    /**
     * Redirect to an external endpoint for OAuth signin.
     * @param {String} endpoint
     *   The endpoint.
     */
    redirect (endpoint) {
      const nextExternal = `${document.location.origin}/${this.next}`
      const query = `next=${nextExternal}`
      window.location = `${siteConfig.pybossaHost}/${endpoint}?${query}`
    }
  }
}
</script>


<style lang="scss" scoped>
@import 'src/assets/style/main';

#oauth-buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;

  .btn {
    @include hover-focus;
    border-radius: 0;
    color: $white;
    height: 100%;
    display: flex;

    @include hover-focus {
      color: $white;
    }

    &.btn-twitter {
      background: $twitter;

      @include hover-focus {
        background: darken($twitter, 5%);
      }
    }

    &.btn-facebook {
      background: $facebook;

      @include hover-focus {
        background: darken($facebook, 5%);
      }
    }

    &.btn-googleplus {
      background: $googleplus;

      @include hover-focus {
        background: darken($googleplus, 5%);
      }
    }
  }

  /* Fix inconsistend heights */
  svg {
    display: flex;
    height: 1.2rem;
  }
}
</style>
