<template>
  <div id="announcements">
    <div class="container my-5">
      <div class="col-lg-8 mx-auto">
        <b-card no-body header="Announcements">
          <announcement-card
            v-for="announcement in announcements"
            :key="announcement.id"
            :announcement="announcement">
          </announcement-card>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import localConfig from '@/local.config'
import AnnouncementCard from '@/components/cards/Announcement'

export default {
  layout: 'default',

  computed: {
    announcements () {
      return this.$store.state.announcements
    }
  },

  head () {
    return {
      title: 'Announcements',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Announcements from ${localConfig.brand}`
        }
      ]
    }
  },

  components: {
    AnnouncementCard
  }
}
</script>
