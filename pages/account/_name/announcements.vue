<template>
  <b-card id="account-announcements" no-body :header="title">
    <announcement-card
      v-for="announcement in announcements"
      :key="announcement.id"
      :announcement="announcement">
    </announcement-card>
    <infinite-load
      ref="infiniteload"
      domain-object="announcement"
      v-model="announcements">
      <span slot="no-results"></span>
      <span slot="no-more"></span>
    </infinite-load>
  </b-card>
</template>

<script>
import AnnouncementCard from '@/components/cards/Announcement'
import InfiniteLoad from '@/components/InfiniteLoad'

export default {
  layout: 'container',

  data () {
    return {
      title: 'Announcements',
      announcements: []
    }
  },

  components: {
    InfiniteLoad,
    AnnouncementCard
  },

  head () {
    return {
      title: this.title
    }
  },

  mounted () {
    this.$store.dispatch('UPDATE_LAST_READ', this.$axios)
  }
}
</script>
