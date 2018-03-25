<template>
  <div id="announcements-list">

    <b-btn
      id="announcements-toggle"
      class="nav-link"
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

    <span v-show="show">
      <b-card
        no-body
        header="Notifications"
        id="announcements-container"
        class="dropdown-menu-right"
        :bg-variant="darkMode ? 'dark' : null"
        :text-variant="darkMode ? 'white' : null">

        <div
          slot="header"
          class="d-flex align-items-center justify-content-between">
          <h6 class="mb-0">
            Notifications
          </h6>
          <b-btn
            size="sm"
            variant="link"
            @click="markAllAsRead">
            <small>
              Mark all as read
            </small>
          </b-btn>
        </div>

        <div id="announcements" class="custom-scrollbar">
          <announcement-card
            v-for="announcement in enhancedAnnouncements"
            :key="announcement.id"
            :announcement="announcement">
          </announcement-card>
          <div class="m-1">
            <b-btn
              v-if="announcements.length"
              size="sm"
              :variant="darkMode ? 'secondary' : 'primary'"
              class="mx-auto"
              :disabled="noMore"
              @click.stop="loadMore">
              Load More
            </b-btn>
            <small v-else>
              There are no notifications yet.
            </small>
          </div>
        </div>
      </b-card>
    </span>
  </div>
</template>

<script>
import 'vue-awesome/icons/bell'
import AnnouncementCard from '@/components/cards/Announcement'

export default {
  data () {
    return {
      show: false,
      noMore: false,
      announcements: []
    }
  },

  components: {
    AnnouncementCard
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },

    userAnnouncements () {
      return this.currentUser.info.announcements || {}
    },

    hasUnread () {
      if (!this.announcements.length) {
        return false
      }
      const lastRead = this.userAnnouncements.last_read
      if (!lastRead) {
        return true
      }
      const lastAnnouncement = this.announcements[0]
      const lastCreated = Date.parse(lastAnnouncement.created)
      return !lastRead || Date.parse(lastRead) < lastCreated
    },

    enhancedAnnouncements () {
      const readIds = this.userAnnouncements.read_ids || []
      const allRead = this.userAnnouncements.all_read
      return this.announcements.map(ann => {
        if (allRead && Date.parse(allRead) > Date.parse(ann.created)) {
          ann._read = true
        } else {
          ann._read = readIds.indexOf(ann.id) > -1
        }
        return ann
      }).filter(ann => {
        // Only show admin announcements to admin users
        return !ann.info.admin || this.currentUser.admin
      })
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
      if (window.innerWidth < 768) {
        // Redirect to the announcements page on small screens
        this.$router.push({
          name: 'account-name-announcements',
          params: {
            name: this.currentUser.name
          }
        })
      } else {
        this.show = !this.show
      }
      this.$store.dispatch('UPDATE_LAST_READ', this.$axios)
    },

    /**
     * Load the next batch of announcements.
     */
    loadMore () {
      const limit = 50
      this.$axios.get('/api/announcement', {
        params: {
          published: true,
          orderby: 'created',
          desc: true,
          limit: limit,
          offset: this.announcements.length
        }
      }).then(response => {
        if (response.data.length) {
          this.announcements = this.announcements.concat(response.data)
          if (response.data.length < limit) {
            this.noMore = true
          }
        } else {
          this.noMore = true
        }
      }).catch(err => {
        this.$nuxt.error(err)
      })
    },

    /**
     * Mark all announcements as read.
     */
    markAllAsRead () {
      this.$store.dispatch('UPDATE_ALL_READ', this.$axios)
    }
  },

  created () {
    this.loadMore()
  }
}
</script>

<style lang="scss">
#announcements-list {
  font-size: $font-size-sm;
  display: flex;
  justify-content: center;
  padding-right: 0;
  position: relative;
  text-transform: none;

  #announcements-toggle {
    display: flex;
    flex-direction: row;
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
    }

    .infinite-status-prompt {
      background: $white;
    }
  }
}
</style>
