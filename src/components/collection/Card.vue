<template>
  <b-card
    no-block
    show-footer
    class="collection-card my-3">
    <router-link
      class="float-right"
      :to="{
        name: 'collection-home',
        params: {
          collectionname: collectionName
        }
      }">
      <div
        class="collection-card-img"
        :style="{ backgroundImage: `url('${collectionConfig.bgImg}')` }">
      </div>
      <div class="card-block">
        <h4 class="card-title">
          {{ collectionConfig.name }}
        </h4>
        <hr class="my-1">
        <p class="card-text">
          {{ collectionConfig.tagline }}
        </p>
      </div>
      <div class="card-footer">
        <icon label="Enter Website">
          <icon name="arrow-right"></icon>
          <icon name="circle-thin" scale="2"></icon>
        </icon>
      </div>
    </router-link>
  </b-card>
</template>

<script>
import 'vue-awesome/icons/arrow-right'
import 'vue-awesome/icons/circle-thin'

export default {
  props: {
    collectionName: {
      type: String,
      required: true
    },
    collectionConfig: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/main';

.collection-card {
  border: none;

  a {
    color: $gray;

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
      color: $gray-lighter;
      background-color: rgba($gray-lighter, 0.4);
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
    color: $gray-dark;
  }

  .card-footer {
    background-color: $white;
    border: none;
    color: $gray-light;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>
