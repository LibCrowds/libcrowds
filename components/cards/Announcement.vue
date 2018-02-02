<template>
  <b-card
    no-body
    :class="styleClass"
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
        <div class="card-title mb-0" v-html="title"></div>
        <div class="card-text mb-0" v-html="body"></div>
      </div>

      <div class="p-1">
        <small class="no-wrap text-muted">
          <span class="d-none d-md-block">
            {{ announcement.created | moment('calendar') }}
          </span>
          <span class="d-md-none">
            {{ announcement.created | moment('L') }}
          </span>
        </small>
        <small
          :v-if="announcement.info.admin"
          class="text-primary float-right">
          Admin
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
      imgSrc: localConfig.pybossaHost + this.announcement.media_url,
      title: marked(this.announcement.title),
      body: marked(this.announcement.body),
      unread: !this.announcement._read
    }
  },

  props: {
    announcement: {
      type: Object,
      required: true
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },

    userAnnouncements () {
      return this.currentUser.info.announcements || {}
    },

    styleClass () {
      return {
        'announcement-card': true,
        unread: this.unread
      }
    }
  },

  methods: {
    /**
     * Handle announcement clicked.
     */
    onClick () {
      this.$emit('click')
      this.markAsRead()
      this.goToUrl()
    },

    /**
     * Handle navigation.
     */
    goToUrl () {
      const url = this.announcement.info.url
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
    },

    /**
     * Mark the announcement as read.
     */
    markAsRead () {
      this.unread = false
      const infoClone = JSON.parse(JSON.stringify(this.currentUser.info))
      const userAnnouncements = infoClone.announcements || {}
      const readIds = userAnnouncements.read_ids || []
      const readSet = new Set(readIds)
      readSet.add(this.announcement.id)
      const newReadIds = Array.from(readSet)
      newReadIds.sort()
      userAnnouncements['read_ids'] = newReadIds
      infoClone.announcements = userAnnouncements
      this.$axios.$put(`/api/user/${this.currentUser.id}`, {
        info: infoClone
      }).then(data => {
        this.$store.dispatch('UPDATE_CURRENT_USER', this.$axios)
      })
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

  &.unread {
    background-color: rgba($blue, 0.1);

    @include hover-focus {
      background-color: rgba($blue, 0.15);
    }
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
    font-weight: 700;
    font-size: $font-size-sm;
  }

  p {
    margin: 0;
  }

  .placeholder {
    border: 1px solid $gray-300;
  }
}
</style>
