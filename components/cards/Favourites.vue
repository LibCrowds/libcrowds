<template>
  <b-card class="favourites-card" :header="'Favourites'">

      <p v-if="!images.length">
        You haven't added any favourite tasks yet.
      </p>
      <v-images
        v-else
        :imgs="images"
        :showclosebutton="true"
        :showcaption="true"
        :modalclose="true"
        :keyinput="true"
        :imagecountseparator="'of'"
        :showimagecount="true"
        :showthumbnails="true">
      </v-images>

  </b-card>
</template>

<script>
export default {
  data: function () {
    return {
      images: []
    }
  },

  methods: {
    /**
     * Load the image data.
     * @param {Array} favourites
     *   The favourite tasks.
     */
    getImageData (favourites) {
      return favourites.map((task) => {
        if ('imgInfoUri' in task.info) {
          return this.getIiifImageData(task)
        } else if ('url_m' in task.info) {
          return this.getFlickrImageData(task)
        }
      })
    },

    /**
     * Get image data based on the imgInfoUri field of the task info.
     * @param {Object} task
     *   The task.
     */
    getIiifImageData (task) {
      const baseUri = task.info.imgInfoUri.replace('/info.json', '')
      return {
        imageUrl: `${baseUri}/full/full/0/default.jpg`,
        caption: `Task ${task.id}`
      }
    },

    /**
     * Get image data based on the url_m field of the task info.
     * @param {Object} task
     *   The task.
     */
    getFlickrImageData (task) {
      return {
        imageUrl: task.info.url,
        caption: `Task ${task.id}`
      }
    }
  },

  mounted () {
    this.$axios.$get('/api/favorites').then(data => {
      this.images = this.getImageData(data)
    }).catch(err => {
      this.$nuxt.error({ statusCode: err.statusCode, message: err.message })
    })
  }
}
</script>
