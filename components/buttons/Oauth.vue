<template>
  <div id="oauth-buttons">

    <b-btn
      v-if="facebook"
      variant="facebook"
      @click="redirect('facebook')">
      <icon name="facebook"></icon>
      Facebook
    </b-btn>

    <b-btn
      v-if="google"
      variant="googleplus"
      @click="redirect('google')">
      <icon name="google"></icon>
      Google
    </b-btn>

    <b-btn
      v-if="twitter"
      variant="twitter"
      @click="redirect('twitter')">
      <icon name="twitter"></icon>
      Twitter
    </b-btn>

  </div>
</template>

<script>
import 'vue-awesome/icons/facebook'
import 'vue-awesome/icons/google'
import 'vue-awesome/icons/twitter'
import localConfig from '@/local.config'

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
    },
    next: {
      type: String,
      required: ''
    }
  },

  methods: {
    /**
     * Redirect to an external endpoint for OAuth signin.
     * @param {String} endpoint
     *   The endpoint.
     */
    redirect (endpoint) {
      const query = `next=${this.next}&response_format=json`
      const url = `${localConfig.pybossaHost}/${endpoint}?${query}`
      window.location.assign(url)
    }
  }
}
</script>


<style lang="scss" scoped>
@import '~assets/style/settings';

#oauth-buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @include media-breakpoint-up (sm) {
    flex-direction: row;
  }

  .btn {
    @include hover-focus;
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    color: $white;
    margin: 0.25rem 0.5rem;

    @include hover-focus {
      color: $white;
    }

    @include media-breakpoint-up (sm) {
      width: auto;
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
    margin-right: 0.5rem;
  }
}
</style>
