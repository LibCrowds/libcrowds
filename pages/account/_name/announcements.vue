<template>
  <card-base :title="title" :description="description">
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
  </card-base>
</template>

<script>
import AnnouncementCard from '@/components/cards/Announcement'
import InfiniteLoad from '@/components/InfiniteLoad'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'container',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'Announcements',
      description: 'All announcements made on the platform',
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
    AnnouncementCard,
    CardBase
  },

  mounted () {
    this.$store.dispatch('UPDATE_LAST_READ', this.$axios)
  }
}
</script>
