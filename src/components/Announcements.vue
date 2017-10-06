<template>
  <div id="announcements">
    <b-button
      id="announcements-toggle"
      class="d-flex"
      @click="toggle"
      v-on-clickaway="hide">
      <icon name="bell"></icon>
      <b-badge
        pill
        v-if="announcements.length"
        variant="info">
        {{ announcements.length }}
      </b-badge>
    </b-button>
    <b-card no-body v-show="show">
      <b-list-group>
        <span
          v-for="announcement in announcements"
          :key="announcement.id">
          <b-list-group-item
            v-if="announcement.isLocal"
            :to="{
              path: announcement.media_url
            }">
            {{ announcement.title }}
          </b-list-group-item>
          <b-list-group-item
            v-else
            :href="announcement.media_url">
            {{ announcement.title }}
          </b-list-group-item>
        </span>
      </b-list-group>
    </b-card>
  </div>
</template>

<script>
import 'vue-awesome/icons/bell'
import { directive as onClickaway } from 'vue-clickaway'
import pybossaApi from '@/api/pybossa'

export default {
  data: function () {
    return {
      show: false
    }
  },

  directives: {
    onClickaway: onClickaway
  },

  props: {
    currentUser: {
      type: Object,
      required: true
    }
  },

  computed: {
    announcements: function () {
      let announcements = this.$store.state.announcements || []
      return announcements.map(announcement => {
        announcement.isLocal = announcement.media_url && (
          announcement.media_url.startsWith(window.location.origin) ||
          announcement.media_url.startsWith('/')
        )
        return announcement
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
      if (this.show) {
        let announcements = this.currentUser.announcements || {}
        announcements['last_read'] = this.announcements[0].id
        this.currentUser.info.announcements = announcements
        pybossaApi.put(`/api/user/${this.currentUser.id}`, {
          info: this.currentUser.info
        }).then(r => {
          this.$store.dispatch('UPDATE_CURRENT_USER')
        })
      }
    }
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/main';

#announcements {
  padding-right: 0;
  position: relative;

  #announcements-toggle {
    cursor: pointer;
    color: inherit;
    background: transparent;
    border: none;

    &:after {
      display: none;
    }
  }

  .card {
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
  }
}
</style>
