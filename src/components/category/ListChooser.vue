<template>
  <b-card
    no-block
    id="category-list-chooser"
    :header="'Categories'">
    <b-list-group>
      <b-popover
        class="hidden-lg-down"
        v-for="category in categories"
        :key="category.id"
        :triggers="popoverTriggers"
        :placement="popoverPlacement(category)"
        :content="category.description">
        <b-list-group-item
          action
          :active="activeCategory === category"
          @click.native="changeCategory(category)">
          {{ category.name }}
        </b-list-group-item>
      </b-popover>
      <b-list-group-item
        class="hidden-xl-up"
        v-for="category in categories"
        :key="category.id"
        action
        :active="activeCategory === category"
        @click.native="changeCategory(category)">
        {{ category.name }}
      </b-list-group-item>
    </b-list-group>
  </b-card>
</template>

<script>
import { sortBy } from 'lodash'
import marked from 'marked'

export default {
  data: function () {
    return {
      activeCategory: null,
      popoverTriggers: [ 'hover' ]
    }
  },

  props: {
    categories: {
      type: Array,
      required: true
    },
    showPopovers: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    processedCategories: function () {
      let categories = this.categories.map((category) => {
        category.description = marked(category.description)
        return category
      })
      return sortBy(categories, 'name')
    }
  },

  methods: {
    /**
     * Change the category.
     * @param {Object} category
     *   The category.
     */
    changeCategory (category) {
      this.$emit('change', category)
      this.activeCategory = category
    },

    /**
     * Used to hide popovers when empty or showPopovers is false.
     * @param {Object} category
     *   The category.
     */
    popoverPlacement (category) {
      return category.description && this.showPopovers ? 'right' : null
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
