<template>
  <div class="social-media-buttons">

    <b-tooltip content="Share on Facebook" triggers="hover">
      <b-btn
        variant="facebook"
        @click="share(facebookUrl, 980, 620)">
        <icon name="facebook"></icon>
      </b-btn>
    </b-tooltip>

    <b-tooltip content="Share on Twitter" triggers="hover">
      <b-btn
        variant="twitter"
        @click="share(twitterUrl, 450, 550)">
        <icon name="twitter"></icon>
      </b-btn>
    </b-tooltip>

    <b-tooltip content="Share on Google Plus" triggers="hover">
      <b-btn
        variant="googleplus"
        @click="share(googleplusUrl, 510, 725)">
        <icon name="google-plus"></icon>
      </b-btn>
    </b-tooltip>

    <b-tooltip content="Share on LinkedIn" triggers="hover">
      <b-btn
        variant="linkedin"
        @click="share(linkedinUrl, 510, 520)">
        <icon name="linkedin"></icon>
      </b-btn>
    </b-tooltip>

  </div>
</template>

<script>
import siteConfig from '@/settings/config'
import 'vue-awesome/icons/facebook'
import 'vue-awesome/icons/twitter'
import 'vue-awesome/icons/google-plus'
import 'vue-awesome/icons/linkedin'

export default {
  data: function () {
    return {
      facebookUrl: `http://www.facebook.com/sharer.php?u=${this.url}`,
      twitterUrl: `https://twitter.com/intent/tweet?` +
                  `original_referer=${this.url}&text=${this.tweet}` +
                  `&tw_p=tweetbutton&url=${this.url}`,
      googleplusUrl: `https://plus.google.com/share?url=${this.url}`,
      linkedinUrl: `https://www.linkedin.com/cws/share?url=${this.url}`
    }
  },

  props: {
    url: {
      type: String,
      default: window.location.href
    },
    tweet: {
      type: String,
      default: `Crowdsourcing from ${config.company}`
    }
  },

  methods: {
    share (url, title, width, height) {
      const specs = `scrollbars=yes,width=${width},height=${height}`
      const popup = window.open(url, 'Share', specs)
      popup.focus()
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/main';

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
