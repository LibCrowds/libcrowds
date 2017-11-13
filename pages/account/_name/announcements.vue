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
      :search-params="searchParams"
      v-model="announcements">
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
      announcements: [],
      searchParams: {
        published: true,
        orderby: 'created',
        desc: true
      }
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
