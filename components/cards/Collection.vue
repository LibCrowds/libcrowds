<template>
  <b-card
    no-body
    show-footer
    class="collection-card my-3">
    <nuxt-link
      :to="{
        name: 'collection-shortname',
        params: {
          shortname: collection.short_name
        }
      }">
      <div
        class="collection-card-img"
        :style="{ backgroundImage: `url('${collection.info.background}')` }">
      </div>
      <div class="card-body">
        <h4 class="card-title">
          {{ collection.name }}
        </h4>
        <hr class="my-1">
        <p class="card-text" v-if="collection.info">
          {{ collection.info.tagline }}
        </p>
      </div>
      <div class="card-footer">
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
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/style/settings';

.collection-card {
  border: none;

  a {
    color: $gray-800;

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
    height: 250px;
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
    background-color: $white;
    border: none;
    color: $gray-600;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>
