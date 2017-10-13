<template>
  <div class="social-media-buttons">

      <b-btn
        v-b-tooltip
        title="Share on Facebook"
        variant="facebook"
        :size="size"
        @click="share(facebookUrl, 980, 620)">
        <icon name="facebook"></icon>
      </b-btn>

      <b-btn
        v-b-tooltip
        title="Share on Twitter"
        variant="twitter"
        :size="size"
        @click="share(twitterUrl, 450, 550)">
        <icon name="twitter"></icon>
      </b-btn>

      <b-btn
        v-b-tooltip
        title="Share on Google Plus"
        variant="googleplus"
        :size="size"
        @click="share(googleplusUrl, 510, 725)">
        <icon name="google-plus"></icon>
      </b-btn>

      <b-btn
        v-b-tooltip
        title="Share on LinkedIn"
        variant="linkedin"
        :size="size"
        @click="share(linkedinUrl, 510, 520)">
        <icon name="linkedin"></icon>
      </b-btn>

  </div>
</template>

<script>
import localConfig from '@/local.config'
import 'vue-awesome/icons/facebook'
import 'vue-awesome/icons/twitter'
import 'vue-awesome/icons/google-plus'
import 'vue-awesome/icons/linkedin'

export default {
  data () {
    return {
      facebookUrl: `http://www.facebook.com/sharer.php?u=${this.shareUrl}`,
      twitterUrl: `https://twitter.com/intent/tweet?` +
                  `original_referer=${this.shareUrl}&text=${this.tweet}` +
                  `&tw_p=tweetbutton&url=${this.shareUrl}`,
      googleplusUrl: `https://plus.google.com/share?url=${this.shareUrl}`,
      linkedinUrl: `https://www.linkedin.com/cws/share?url=${this.shareUrl}`
    }
  },

  props: {
    shareUrl: {
      type: String,
      required: true
    },
    tweet: {
      type: String,
      default: localConfig.tagline
    },
    size: {
      type: String,
      default: ''
    }
  },

  methods: {
    share (url, width, height) {
      const specs = `scrollbars=yes,width=${width},height=${height}`
      const popup = window.open(url, 'Share', specs)
      popup.focus()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/style/main';

.social-media-buttons {
  div {
    display: inline-block;
  }

  .btn {
    @include hover-focus;
    border-radius: 0;
    color: $white;

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

    &.btn-linkedin {
      background: $linkedin;

      @include hover-focus {
        background: darken($linkedin, 5%);
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
