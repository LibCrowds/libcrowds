<template>
  <div class="project-thumbnail" :data-type="chosenType">

    <v-gravatar
      v-if="chosenType === 'gravatar'"
      :email="project.short_name"
      :size="200"
      default-img="identicon"
      :class="imgClass"
      :alt="altTag">
    </v-gravatar>

    <img
      v-else
      :src="thumbnail"
      :class="imgClass"
      :alt="altTag">

  </div>
</template>

<script>
import axios from 'axios'
import siteConfig from '@/settings/siteConfig'
import pybossaApi from '@/api/pybossa'

export default {
  data: function () {
    return {
      altTag: `Thumbnail for ${this.project.name}`,
      preferences: JSON.parse(JSON.stringify(siteConfig.thumbnailPreferences)),
      thumbnail: null,
      chosenType: null,
      imgClass: `hoizontal-${this.horizontalBreakpoint}-up`
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
          axios.get(r.data[0].info.manifestUri).then((r) => {
            if ('thumbnail' in r.data && Array.isArray(r.data.thumbnail)) {
              this.thumbnail = r.data.thumbail[0]['@id']
            } else if ('thumbnail' in r.data) {
              this.thumbnail = r.data.thumbnail['@id']
            } else {
              this.loadNext()
            }
          })
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
        return
      }

      if (custom.indexOf('/uploads') > -1) {
        this.thumbnail = siteConfig.pybossaHost + custom
        return
      }
      this.thumbnail = custom
    },

    /**
     * Attempt to load the thumbnail of the next type.
     */
    loadNext () {
      const type = this.preferences.shift()
      this.chosenType = type
      if (type === 'custom') {
        this.setCustomThumbnail()
      } else if (type === 'iiif') {
        this.setIiifThumbnail()
      } else if (type === 'gravatar') {
        this.thumbnail = 'gravatar'
      }
    }
  },

  created () {
    this.loadNext()
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/main';

.project-thumbnail {
  height: 100%;
  width: auto;

  &[data-type="iiif"] {
    background-color: black;
    display: flex;
    justify-content: center;

    img {
      margin: 25px;
      position: relative;
      height: calc(100% - 50px);
    }
  }

  img {
    width: 100%;
    height: auto;
  }
}
</style>
