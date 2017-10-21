<template>
  <b-card
    no-body
    class="announcement-card"
    @click="onClick">
    <div class="d-flex flex-row">

      <div class="p-1">
        <img
          v-if="announcement.media_url"
          :src="imgSrc"
          size
          class="img-announcement img-fluid rounded-circle">
        </img>
        <div
          v-else
          class="img-fluid img-announcement rounded-circle placeholder">
          <icon name="question" scale="2"></icon>
        </div>
      </div>

      <div class="p-1 flex-grow">
        <div class="card-title mb-0" v-html="content"></div>
      </div>

      <div class="p-1">
        <small class="no-wrap text-muted">
          {{ announcement.created | moment('calendar') }}
        </small>
      </div>

    </div>
  </b-card>
</template>

<script>
import marked from 'marked'
import 'vue-awesome/icons/question'
import localConfig from '@/local.config'

export default {
  data () {
    return {
      imgSrc: localConfig.pybossa.host + this.announcement.media_url,
      content: marked(this.announcement.title)
    }
  },

  props: {
    announcement: {
      type: Object,
      required: true
    }
  },

  methods: {
    /**
     * Handle navigation when the card is clicked.
     */
    onClick () {
      const url = this.announcement.body
      const parser = document.createElement('a')
      const internal = this.isInternal(url)
      if (internal) {
        parser.href = url
        this.$router.push({ path: parser.pathname })
      } else if (url) {
        window.open(url)
      }
    },

    /**
     * Return true if the URL is internal, false otherwise
     * @param {String} url
     *   The URL to be checked.
     */
    isInternal (url) {
      const origin = window.location.origin
      return url && (url.startsWith(origin) || url.startsWith('/'))
    }
  }
}
</script>

<style lang="scss">
@import '~assets/style/settings';

.announcement-card {
  cursor: pointer;
  display: block;
  border-top: none;
  border-left: none;
  border-right: none;

  @include hover-focus {
    background-color: $gray-100;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  .flex-grow {
    flex: 1 1 auto;
  }

  .no-wrap {
    white-space: nowrap;
  }

  .img-announcement {
    width: 50px;
    height: 50px;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: $font-family-base;
    margin-top: 2px;
    margin-bottom: 0;
    font-size: $font-size-sm;
    text-transform: uppercase;
  }

  .card-title {
    font-size: $font-size-sm;
  }

  p {
    margin: 0;
  }
}
</style>
