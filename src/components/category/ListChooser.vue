<template>
  <b-card
    no-block
    id="category-list-chooser"
    :header="header | pluralize | capitalize">
    <b-list-group>
      <b-list-group-item
        v-for="(category, index) in categories"
        :key="category.id"
        action
        v-b-toggle="`catlistitem-${category.id}`"
        :active="activeCategory === category"
        @click.native="changeCategory(category)">
        {{ category.name }}
        <b-collapse
          :visible="index == 0"
          accordion="catlist-accordian"
          :id="`catlistitem-${category.id}`">
          <small
            class="category-description"
            v-html="getDescription(category)">
          </small>
        </b-collapse>
      </b-list-group-item>
    </b-list-group>
  </b-card>
</template>

<script>
import marked from 'marked'

export default {
  data: function () {
    return {
      activeCategory: null
    }
  },

  props: {
    categories: {
      type: Array,
      required: true
    },
    header: {
      type: String,
      required: true
    }
  },

  methods: {
    /**
     * Change the category.
     * @param {Object} category
     *   The category.
     */
    changeCategory (category) {
      if (this.activeCategory !== category) {
        this.$emit('change', category)
        this.activeCategory = category
      }
    },

    /**
     * Return the markdown processed category description.
     * @param {Object} category
     *   The category.
     */
    getDescription (category) {
      const desc = category.description ? category.description : ''
      return marked(desc)
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
    @extend .bg-light;
    text-align: center;
    padding: $list-group-item-padding-y $list-group-item-padding-x;
  }

  .list-group-item {
    cursor: default;
    display: block;
    border-left: none;
    border-right: none;

    &:first-child {
      border-top: none;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  .category-description {
    p {
      margin-bottom: 0;
    }
  }

  .card-body {
    display: flex;
    flex-direction: column;
  }
}
</style>
