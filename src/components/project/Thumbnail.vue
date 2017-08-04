<template>
  <div class="project-thumbnail">

    <img
      v-if="customThumbnail"
      :src="customThumbnail"
      :alt="altTag"
      class="img-responsive">
    </img>

    <div
    v-else
    class="thumbnail-container">
      <div class="thumbnail">
        <iframe
          :src="previewSource"
          frameborder="0"
          onload="this.style.opacity = 1">
        </iframe>
      </div>
    </div>


  </div>
</template>

<script>
import config from '@/config'

export default {
  data () {
    return {
      imgError: false,
      altTag: `Thumbnail for ${this.project.name}`
    }
  },

  props: {
    project: {
      type: Object,
      required: true
    }
  },

  computed: {
    customThumbnail: function () {
      const hasCustom = (
        'thumbnail_url' in this.project.info &&
        this.project.info.thumbnail_url !== null
      )

      if (!hasCustom || config.ignoreCustomThumbnail) {
        return null
      }

      if (this.project.info.thumbnail_url.startsWith('/uploads')) {
        return config.pybossaHost + this.project.info.thumbnail_url
      }
      return this.project.info.thumbnail_url
    },

    previewSource: function () {
      const route = this.$router.resolve({
        name: 'presenter',
        params: {
          shortname: this.project.short_name
        }
      })
      return route.href
    }
  }
}
</script>

<style lang="scss" scoped>
img {
  width: 100%;
  height: auto;
}

/* Variables */
$thumbnail-width: 1200px;
$thumbnail-height: 1000px;
$thumbnail-zoom: 0.25;

/* This container helps the thumbnail behave as if it were an unscaled IMG element */
.thumbnail-container {
  width: calc(#{$thumbnail-width} * #{$thumbnail-zoom});
  height: calc(#{$thumbnail-height} * #{$thumbnail-zoom});
  display: inline-block;
  overflow: hidden;
  position: relative;
  background: #f9f9f9;
}

/* Image Icon for the Background */
.thumbnail-container::before {
  position: absolute;
  left: calc(50% - 16px);
  top: calc(50% - 18px);
  opacity: 0.2;
  display: block;
  -ms-zoom: 2;
  -o-transform: scale(2);
  -moz-transform: scale(2);
  -webkit-transform: scale(2);
  transform: scale(2);
  content: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDMyIDMyIiBoZWlnaHQ9IjMycHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMycHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnIGlkPSJwaG90b18xXyI+PHBhdGggZD0iTTI3LDBINUMyLjc5MSwwLDEsMS43OTEsMSw0djI0YzAsMi4yMDksMS43OTEsNCw0LDRoMjJjMi4yMDksMCw0LTEuNzkxLDQtNFY0QzMxLDEuNzkxLDI5LjIwOSwwLDI3LDB6ICAgIE0yOSwyOGMwLDEuMTAyLTAuODk4LDItMiwySDVjLTEuMTAzLDAtMi0wLjg5OC0yLTJWNGMwLTEuMTAzLDAuODk3LTIsMi0yaDIyYzEuMTAyLDAsMiwwLjg5NywyLDJWMjh6IiBmaWxsPSIjMzMzMzMzIi8+PHBhdGggZD0iTTI2LDRINkM1LjQ0Nyw0LDUsNC40NDcsNSw1djE4YzAsMC41NTMsMC40NDcsMSwxLDFoMjBjMC41NTMsMCwxLTAuNDQ3LDEtMVY1QzI3LDQuNDQ3LDI2LjU1Myw0LDI2LDR6ICAgIE0yNiw1djEzLjg2OWwtMy4yNS0zLjUzQzIyLjU1OSwxNS4xMjMsMjIuMjg3LDE1LDIyLDE1cy0wLjU2MSwwLjEyMy0wLjc1LDAuMzM5bC0yLjYwNCwyLjk1bC03Ljg5Ni04Ljk1ICAgQzEwLjU2LDkuMTIzLDEwLjI4Nyw5LDEwLDlTOS40NCw5LjEyMyw5LjI1LDkuMzM5TDYsMTMuMDg3VjVIMjZ6IE02LDE0LjZsNC00LjZsOC4wNjYsOS4xNDNsMC41OCwwLjY1OEwyMS40MDgsMjNINlYxNC42eiAgICBNMjIuNzQsMjNsLTMuNDI4LTMuOTU1TDIyLDE2bDQsNC4zNzlWMjNIMjIuNzR6IiBmaWxsPSIjMzMzMzMzIi8+PHBhdGggZD0iTTIwLDEzYzEuNjU2LDAsMy0xLjM0MywzLTNzLTEuMzQ0LTMtMy0zYy0xLjY1OCwwLTMsMS4zNDMtMywzUzE4LjM0MiwxMywyMCwxM3ogTTIwLDhjMS4xMDIsMCwyLDAuODk3LDIsMiAgIHMtMC44OTgsMi0yLDJjLTEuMTA0LDAtMi0wLjg5Ny0yLTJTMTguODk2LDgsMjAsOHoiIGZpbGw9IiMzMzMzMzMiLz48L2c+PC9zdmc+");
}

/* This is a masking container for the zoomed iframe element */
.thumbnail {
  -ms-zoom: $thumbnail-zoom;
  -moz-transform: scale(#{$thumbnail-zoom});
  -moz-transform-origin: 0 0;
  -o-transform: scale(#{$thumbnail-zoom});
  -o-transform-origin: 0 0;
  -webkit-transform: scale(#{$thumbnail-zoom});
  -webkit-transform-origin: 0 0;
  transform: scale(#{$thumbnail-zoom});
  transform-origin: 0 0;
}

/* This is our screen sizing */
.thumbnail, .thumbnail iframe {
  width: $thumbnail-width;
  height: $thumbnail-height;
}

.thumbnail iframe {
  opacity: 0;
  transition: all 300ms ease-in-out;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.thumbnail:after {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
