<template>
  <b-card
    no-block
    show-footer
    class="collection-card my-5">
    <div
      class="collection-card-img"
      :style="{ backgroundImage: `url('${collectionConfig.bgImg}')` }">
    </div>
    <div class="card-block">
      <h4 class="card-title">
        {{ collectionConfig.name }}
      </h4>
      <p class="card-text">
        {{ collectionConfig.tagline }}
      </p>
    </div>
    <div class="card-footer">
      <b-button
        class="float-right"
        variant="success"
        :to="{
          name: 'collection-home',
          params: {
            collectionname: collectionName
          }
        }">
        Enter
      </b-button>
    </div>
  </b-card>
</template>

<script>
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

  .collection-card-img {
    height: 250px;
    width: auto;
    overflow: hidden;
    position: relative;
    background-position: top center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .card-title {
    font-size: $font-size-base;
    font-family: $font-family-base;
    font-weight: 600;
    text-transform: uppercase;
  }

  .card-footer {
    background-color: $white;
    border: none;
  }
}
</style>
