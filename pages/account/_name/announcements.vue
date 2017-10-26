<template>
  <div id="account-announcements">
    <b-container class="my-5">
      <b-card no-body :header="title">

        <announcement-card
          v-for="announcement in announcements"
          :key="announcement.id"
          :announcement="announcement">
        </announcement-card>
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
    </b-container>
  </div>
</template>

<script>
import AnnouncementCard from '@/components/cards/Announcement'
import InfiniteLoad from '@/components/InfiniteLoad'

export default {
  layout: 'default',

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
