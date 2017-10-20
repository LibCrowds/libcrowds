<template>
  <b-card
    no-body
    class="announcement-card"
    @click="onClick">
    <div class="d-flex flex-row">
      <div class="p-1 flex-grow">
        <div class="card-title mb-0">
          <strong>
            {{ announcement.title }}
          </strong>
        </div>
        <div class="card-text">
          {{ announcement.body }}
        </div>
      </div>
      <div class="p-1">
        <small class="text-muted">
          {{ announcement.created | moment('calendar') }}
        </small>
      </div>
    </div>
  </b-card>
</template>

<script>

export default {
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
      const url = this.announcement.media_url
      const internal = this.isInternal(url)
      if (internal) {
        this.$router.push({ path: window.location.path })
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

<style lang="scss" scoped>
@import '~assets/style/settings';

.announcement-card {
  cursor: pointer;

  a {
    text-decoration: none;
    color: inherit;
  }

  .flex-grow {
    flex: 1 1 auto;
  }

  @include hover-focus {
    background-color: $gray-100;
  }
}
</style>
