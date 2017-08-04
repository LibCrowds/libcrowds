<template>
  <div class="project-thumbnail">

    <img
      :src="thumbnail"
      :alt="altTag">

  </div>
</template>

<script>
import axios from 'axios'
import config from '@/config'
import pybossaApi from '@/api/pybossa'

export default {
  data () {
    return {
      altTag: `Thumbnail for ${this.project.name}`,
      preference: JSON.parse(JSON.stringify(config.thumbnailPreference)),
      thumbnail: null
    }
  },

  props: {
    project: {
      type: Object,
      required: true
    }
  },

  methods: {
    /**
     * Set a IIIF thumbnail.
     *
     * Searches the first task of the project for a manifestUri and returns
     * the first thumbnail URL contained within, if any.
     */
    setIiifThumbnail () {
      const taskUrl = `/api/task?project_id=${this.project.id}&limit=1`
      pybossaApi.get(taskUrl).then((r) => {
        if (r.data.length && 'manifestUri' in r.data[0].info) {
          return axios.get(r.data[0].info.manifestUri)
        }
        this.loadNext()
      }).then((r) => {
        if ('thumbnail' in r.data && Array.isArray(r.data.thumbnail)) {
          this.thumbnail = r.data.thumbail[0]['@id']
        } else if ('thumbnail' in r.data) {
          this.thumbnail = r.data.thumbnail['@id']
        } else {
          this.loadNext()
        }
      })
    },

    /**
     * Set a custom thumbnail.
     */
    setCustomThumbnail () {
      const custom = this.project.info.thumbnail_url

      if (custom === undefined || custom === null) {
        this.loadNext()
      }

      if (custom.startsWith('/uploads')) {
        this.thumbnail = config.pybossaHost + custom
        return
      }
      this.thumbnail = custom
    },

    /**
     * Attempt to load the thumbnail of the next type.
     */
    loadNext () {
      console.log(this.preference)
      const type = this.preference.shift()
      if (type === 'custom') {
        console.log('custom')
        this.setCustomThumbnail()
      } else if (type === 'iiif') {
        console.log('iiif')
        this.setIiifThumbnail()
      } else if (type === 'gravatar') {
        console.log('gravatar')
        this.setGravatarThumbnail()
      } else {

      }
    }
  },

  created () {
    this.loadNext()
  }
}
</script>

<style lang="scss" scoped>
.project-thumbnail {
  max-width: 100%;
  height: 100%;
  background-color: black;
  display: flex;
  justify-content: center;

  img {
    margin: 25px;
    position: relative;
    height: calc(100% - 50px);
  }
}
</style>
