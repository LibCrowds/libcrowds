<template>
  <b-card
    no-body
    show-footer
    :bg-variant="darkMode ? 'dark' : null"
    :text-variant="darkMode ? 'white' : null"
    class="collection-card my-3">
    <nuxt-link
      :to="{
        name: 'collection-short_name',
        params: {
          short_name: collection.short_name
        }
      }">
      <div class="collection-card-img main-app-bg" :style="cardBgStyle" style=" height: 250px !important;
    width: auto;
    overflow: hidden;
    position: relative;
    background-position: top center;
    background-size: cover;
    background-repeat: no-repeat;">
      </div>
      <div class="card-body">
        <h3 class="card-title text-dark">
          {{ collection.name }}
        </h3>
        <hr class="my-1">
        <p class="card-text text-muted" v-if="collection.info">
          {{ collection.info.tagline }}
        </p>
      </div>
      <div class="card-footer text-muted">
        <icon label="Enter Website">
          <icon name="arrow-right"></icon>
          <icon name="circle-thin" scale="2"></icon>
        </icon>
      </div>
    </nuxt-link>
  </b-card>
</template>

<script>
import 'vue-awesome/icons/arrow-right'
import 'vue-awesome/icons/circle-thin'

export default {
  props: {
    collection: {
      type: Object,
      required: true
    }
  },

  computed: {
    cardBgStyle () {
      if (!this.collection.info || !this.collection.info.background) {
        return
      }
      return {
        backgroundImage: `url('${this.collection.info.background}')`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.collection-card {
  border: none;

  &.bg-dark {
    .card-title {
      color: $gray-400;
    }

    hr {
      border-color: $gray-900;
    }

    .collection-card-img:after {
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
    .collection-card-img:after {
      opacity: 1;
    }
  }

  .collection-card-img {
    height: 250px i !important;
    width: auto;
    overflow: hidden;
    position: relative;
    background-position: top center;
    background-size: cover;
    background-repeat: no-repeat;

    &:after {
      content: 'Enter';
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


.collection-card a {
  color : #000  !important
}