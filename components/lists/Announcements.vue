<template>
  <div id="announcements">

    <b-button
      v-if="showAnnouncements"
      id="announcements-toggle"
      class="d-flex"
      @click="toggle"
      v-on-clickaway="hide">
      <icon name="bell"></icon>
      <b-badge
        pill
        v-if="unread.length"
        variant="info">
        {{ unread.length }}
      </b-badge>
    </b-button>

    <b-card
      id="announcements-container"
      no-body
      v-show="show">

      <div
        v-if="announcementsEmpty"
        class="card-body text-center border-bottom">
        We have not made any announcements
      </div>

      <div id="announcements-list">
        <announcement-card
          v-for="announcement in announcements"
          :key="announcement.id"
          :announcement="announcement">
        </announcement-card>
      </div>

      <div class="card-footer p-1 text-center font-size-sm footer">
        <!-- <nuxt-link
        :to="{
          name: 'announcements-key'
        }"> -->
        <strong>See all</strong>
        <!-- </nuxt-link> -->
      </div>

    </b-card>
  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import pybossa from '@/api/pybossa'
import 'vue-awesome/icons/bell'
import AnnouncementCard from '@/components/cards/Announcement'

export default {
  data: function () {
    return {
      show: false
    }
  },

  components: {
    AnnouncementCard
  },

  computed: {
    announcements () {
      return this.$store.state.announcements
    },
    currentUser () {
      return this.$store.state.currentUser
    },
    showAnnouncements () {
      return !isEmpty(this.currentUser)
    },
    announcementsEmpty () {
      return isEmpty(this.announcements)
    },
    lastReadId () {
      const userAnnouncements = this.currentUser.info.announcements || {}
      return userAnnouncements['last_read'] || 0
    },
    unread () {
      if (this.announcementsEmpty) {
        return ''
      }
      return this.announcements.filter(announcement => {
        return announcement.id > this.lastReadId
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
     * Toggle the announcements and mark as read if shown.
     */
    toggle () {
      this.show = !this.show
      if (
        !this.show ||
        this.announcementsEmpty ||
        this.lastReadId >= this.announcements[0].id
      ) {
        return
      }

      // Set last read announcement for the user
      this.currentUser.info.announcements.lead_read = this.announcements[0].id
      pybossa.client.put(`/api/user/${this.currentUser.id}`, {
        info: this.currentUser.info
      }).then(r => {
        this.$store.dispatch('UPDATE_CURRENT_USER')
      })
    }
  }
}
</script>

<style lang="scss">
@import '~assets/style/settings';

#announcements {
  padding-right: 0;
  position: relative;
  text-transform: none;

  #announcements-toggle {
    cursor: pointer;
    color: inherit;
    background: transparent;
    border: none;

    &:after {
      display: none;
    }
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

    #announcements-list {
      max-height: 400px;
      overflow-y: auto;
    }
  }

  .card:not(#announcements-container) {
    border-top: none;
    border-left: none;
    border-right: none;
  }

  .border-bottom {
    border-bottom: 1px solid $gray-300;
  }
}
</style>
