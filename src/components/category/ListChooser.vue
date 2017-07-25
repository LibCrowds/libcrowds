<template>
  <div id="category-list-chooser" class="row">
    <div class="col-md-4">
      <b-card id="categories-card">
        <b-list-group>
          <b-list-group-item
            action
            v-for="c in categories"
            :key="c.id"
            :active="activeCategory === c"
            @click.native="changeCategory(c)">
            {{ c.name }}
          </b-list-group-item>
        </b-list-group>
      </b-card>
    </div>
    <div class="col-md-8">
      <b-card>
        <p
          v-for="c in categories"
          :key="c.id"
          v-if="activeCategory === c"
          v-html="marked(c.description)">
        </p>
      </b-card>
    </div>
  </div>
</template>

<script>
import marked from 'marked'
import pybossaApi from '@/api/pybossa'

export default {
  data: function () {
    return {
      categories: [],
      activeCategory: null
    }
  },

  computed: {
    cardClass: function (category) {
      console.log(category)
      return {
        display: category === this.activeCategory ? 'block' : 'none'
      }
    }
  },

  methods: {
    /**
     * Load the categories.
     */
    loadCategories () {
      pybossaApi.get('/').then(r => {
        this.categories = r.data.categories
        this.changeCategory(this.categories[0])
      })
    },

    marked: marked,

    /**
     * Change the category.
     */
    changeCategory (category) {
      this.$emit('change', category)
      this.activeCategory = category
    }
  },

  created () {
    this.loadCategories()
  }
}
</script>

<style lang="scss">
#category-list-chooser{
  .card {
    height: 200px;

    .card-block {
      overflow: scroll;
    }
  }

  #categories-card {
    .card-block {
      padding: 0;

      .list-group-item {
        border-left: none;
        border-right: none;

        &:first-child {
          border-top: none;
        }
      }
    }
  }
}
</style>
