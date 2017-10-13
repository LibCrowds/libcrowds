<template>
  <b-card class="favourites-card" no-body :header="'Favourites'">

    <loading
      v-if="loading"
      text="Loading favourites">
    </loading>

    <div
      v-else
      class="card-body">
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
    </div>
  </b-card>
</template>

<script>
import pybossa from '@/api/pybossa'
import Loading from '@/components/Loading'

export default {
  data: function () {
    return {
      loading: true,
      images: []
    }
  },

  components: {
    Loading
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
    pybossa.getFavourites().then(r => {
      this.images = this.getImageData(r.data)
      this.loading = false
    })
  }
}
</script>
