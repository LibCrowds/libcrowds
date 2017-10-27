<template>
  <div id="announcements-list">

    <b-btn
      id="announcements-toggle"
      class="nav-item d-none d-md-flex"
      v-on-clickaway="hide"
      @click="toggle">
      <icon name="bell"></icon>
      <b-badge
        pill
        id="unread-badge"
        v-if="hasUnread"
        variant="info">
        &nbsp;
      </b-badge>
    </b-btn>

    <nuxt-link
      class="d-md-none nav-link"
      :to="{
        name: 'account-name-announcements',
        params: {
          name: currentUser.name
        }
      }">
      Notifications
    </nuxt-link>

    <span v-show="show">
      <b-card
        header="Notifications"
        id="announcements-container"
        class="dropdown-menu-right d-none d-md-block"
        no-body>

        <div id="announcements">
          <announcement-card
            v-for="announcement in announcements"
            :key="announcement.id"
            :announcement="announcement">
          </announcement-card>
        </div>

        <infinite-load
          ref="infiniteload"
          :search-params="searchParams"
          domain-object="announcement"
          v-model="announcements">
          <span slot="no-results"></span>
          <span slot="no-more"></span>
        </infinite-load>
      </b-card>
    </span>
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
        this.$store.dispatch('UPDATE_LAST_READ', this.$axios)
      }
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
    padding: .5rem 1rem;

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
