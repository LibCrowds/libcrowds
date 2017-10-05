<template>
  <div id="announcements">
    <b-button
      id="announcements-toggle"
      class="d-flex"
      @click="show = !show"
      v-on-clickaway="hide">
      <icon name="bell"></icon>
      <b-badge pill variant="info">{{ unread.length }}</b-badge>
    </b-button>
    <b-card no-body v-show="show">
      <b-list-group>
        <b-list-group-item
          v-for="announcement in announcements"
          :key="announcement.id"
          :href="announcement.media_url">
          {{ announcement.title }}
        </b-list-group-item>
      </b-list-group>
    </b-card>
  </div>
</template>

<script>
import 'vue-awesome/icons/bell'
import { directive as onClickaway } from 'vue-clickaway'

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
      return this.$store.state.announcements
    },
    unread: function () {
      const read = this.currentUser.read || []
      return this.announcements.filter(announcement => {
        return (
          !(announcement.id in read) &&
          announcement.created > this.currentUser.created
        )
      })
    }
  },

  methods: {
    /**
     * Hide the announcements.
     */
    hide () {
      this.show = false
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
