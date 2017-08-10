<template>
  <b-card
    no-block
    id="category-list-chooser"
    :header="'Categories'">
    <b-popover
      v-for="category in categories"
      :key="category.id"
      :triggers="popoverTrigger"
      :placement="popoverPlacement"
      :content="marked(category.description)">
      <b-list-group>
        <b-list-group-item
          action
          :active="activeCategory === category"
          @click.native="changeCategory(category)">
          {{ category.name }}
        </b-list-group-item>
      </b-list-group>
    </b-popover>
  </b-card>
</template>

<script>
import marked from 'marked'

export default {
  data: function () {
    return {
      activeCategory: null,
      popoverTrigger: 'hover',
      popoverPlacement: 'right'
    }
  },

  props: {
    categories: {
      type: Array,
      required: true,
      validator: value => {
        return value.length > 0
      }
    }
  },

  methods: {

    marked: marked,

    /**
     * Change the category.
     */
    changeCategory (category) {
      this.$emit('change', category)
      this.activeCategory = category
    }
  },

  mounted () {
    this.changeCategory(this.categories[0])
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/main';

#category-list-chooser {
  font-size: $font-size-sm;
  max-height: 200px;
  overflow-y: auto;

  @include media-breakpoint-up(xl) {
    max-height: 100%;
  }

  .card-header {
    @extend .bg-faded;
    text-align: center;
    padding: $list-group-item-padding-y $list-group-item-padding-x;
  }

  .list-group-item {
    cursor: default;
    border-left: none;
    border-right: none;

    &:first-child {
      border-top: none;
    }
  }

  .card-block {
    display: flex;
    flex-direction: column;
  }
}
</style>
