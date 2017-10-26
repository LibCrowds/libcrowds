<template>
  <div id="announcements-list">

    <b-button
      id="announcements-toggle"
      class="d-flex nav-link"
      @click="toggle"
      v-on-clickaway="hide">
      <icon name="bell"></icon>
      <b-badge
        pill
        id="unread-badge"
        v-if="hasUnread"
        variant="info">
        &nbsp;
      </b-badge>
    </b-button>

    <b-card
      header="Notifications"
      id="announcements-container"
      class="dropdown-menu-right"
      no-body
      v-show="show">

      <div id="announcements">
        <announcement-card
          v-for="announcement in announcements"
          :key="announcement.id"
          :announcement="announcement">
        </announcement-card>
      </div>

      <infinite-load
        ref="infiniteload"
        :distance="1000"
        :search-params="searchParams"
        domain-object="announcement"
        v-model="announcements">
        <span slot="no-results"></span>
        <span slot="no-more"></span>
      </infinite-load>
    </b-card>
  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import 'vue-awesome/icons/bell'
import InfiniteLoad from '@/components/InfiniteLoad'
import AnnouncementCard from '@/components/cards/Announcement'

export default {
  data () {
    return {
      show: false,
      announcements: [],
      searchParams: {
        orderby: 'created',
        desc: true
      }
    }
  },

  components: {
    AnnouncementCard,
    InfiniteLoad
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },

    noAnnouncements () {
      return isEmpty(this.lastAnnouncement)
    },

    lastAnnouncement () {
      return this.$store.state.lastAnnouncement
    },

    lastReadId () {
      const userAnnouncements = this.currentUser.info.announcements || {}
      return userAnnouncements['last_read'] || 0
    },

    hasUnread () {
      if (this.noAnnouncements) {
        return false
      }
      return this.lastReadId < this.lastAnnouncement.id
    }
  },

  methods: {
    /**
     * Hide the announcements.
     */
    hide () {
      this.show = false
    },

    /**
     * Toggle the announcements.
     */
    toggle () {
      this.show = !this.show
      if (this.show) {
        this.initLoad()
      }
      if (this.show && this.hasUnread) {
        this.setLastRead()
      }
    },

    /**
     * Set last read announcement for the current user.
     */
    setLastRead () {
      const announcements = this.currentUser.info.announcements || {}
      announcements.last_read = this.lastAnnouncement.id
      this.currentUser.info.announcements = announcements
      this.$axios.$put(`/api/user/${this.currentUser.id}`, {
        info: this.currentUser.info
      }).then(data => {
        this.$store.dispatch('UPDATE_CURRENT_USER', this.$axios)
      }).catch(err => {
        this.$nuxt.error({ statusCode: err.statusCode, message: err.message })
      })
    },

    /**
     * Trigger initial load manually (necessary before scrolling starts).
     */
    initLoad () {
      this.$refs.infiniteload.initLoad()
    }
  }
}
</script>

<style lang="scss">
@import '~assets/style/settings';

#announcements-list {
  display: flex;
  padding-right: 0;
  position: relative;
  text-transform: none;

  #announcements-toggle {
    cursor: pointer;
    background: transparent;
    border: none;

    &:after {
      display: none;
    }
  }

  #unread-badge {
    font-size: 0.5rem;
  }

  #announcements-container {
    font-weight: 400;
    position: absolute;
    right: 0;
    top: 100%;
    width: 400px;
    font-size: $font-size-sm;
    padding: 0;
    z-index: $zindex-dropdown;

    .list-group {
      border: none;
    }

    .announcement-card {
      @include hover-focus {
        background: rgba($gray-300, 0.25);
      }
    }

    #announcements {
      max-height: 400px;
      overflow-y: auto;
      border-bottom: 1px solid $gray-300;
    }

    .infinite-status-prompt {
      background: $white;
    }
  }
}
</style>
