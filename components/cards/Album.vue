<template>
  <b-card
    no-body
    show-footer
    :bg-variant="darkMode ? 'dark' : null"
    :text-variant="darkMode ? 'white' : null"
    class="album-card my-3">
      <div class="album-card-img main-app-bg" :style="cardBgStyle">
      </div>
      <div class="card-body">
        <h4 class="card-title">
          {{ title }}
        </h4>
        <hr class="mx-0 my-1">
        <p class="card-text" v-if="description">
          {{ description }}
        </p>
      </div>
      <div class="card-footer">
        <icon label="Enter Website">
          <icon name="arrow-right"></icon>
          <icon name="circle-thin" scale="2"></icon>
        </icon>
      </div>
  </b-card>
</template>

<script>
import 'vue-awesome/icons/arrow-right'
import 'vue-awesome/icons/circle-thin'

export default {
  props: {
    thumbnail: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: 'Unknown'
    },
    description: {
      type: String,
      default: ''
    }
  },

  computed: {
    cardBgStyle () {
      return {
        backgroundImage: `url('${this.thumbnail}')`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.album-card {
  text-align: center;

  &.bg-dark {
    .card-title {
      color: $gray-400;
    }

    hr {
      border-color: $gray-900;
    }

    .album-card-img:after {
      background-color: rgba($gray-1000, 0.4);
    }
  }

  a {
    color: inherit;
    height: 100%;
    display: flex;
    flex-direction: column;

    @include hover-focus {
      text-decoration: none;
    }
  }

  @include hover-focus {
    .album-card-img:after {
      opacity: 1;
    }
  }

  .album-card-img {
    height: 250px;
    width: auto;
    overflow: hidden;
    position: relative;
    background-position: top center;
    background-size: cover;
    background-repeat: no-repeat;

    &:after {
      content: 'View Album';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      color: $gray-300;
      background-color: rgba($gray-300, 0.4);
      opacity: 0;
      font-size: $font-size-lg;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 250ms ease-in;
    }
  }

  .card-title {
    font-size: $font-size-base;
    font-family: $font-family-base;
    font-weight: 600;
    text-transform: uppercase;
    color: $gray-1000;
  }

  .card-footer {
    background-color: inherit;
    border: none;
    color: $gray-600;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>
