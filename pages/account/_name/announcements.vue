<template>
  <card-base :title="title" :description="description">
    <announcement-card
      v-for="announcement in enhancedAnnouncements"
      :key="announcement.id"
      :announcement="announcement">
    </announcement-card>
    <infinite-load
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
      description: 'All announcements made on the platform.',
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

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },

    userAnnouncements () {
      return this.currentUser.info.announcements || {}
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

  mounted () {
    this.$store.dispatch('UPDATE_LAST_READ', this.$axios)
  }
}
</script>
