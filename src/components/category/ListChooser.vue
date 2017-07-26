<template>
  <div id="category-list-chooser" class="row">
    <div class="col-md-4">
      <b-card id="categories-card">

        <loading
          v-if="loading"
          text="Loading categories">
        </loading>

        <b-list-group v-else>
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

        <loading
          v-if="loading"
          text="Loading descriptions">
        </loading>

        <span v-else>
          <p
            v-if="activeCategory === c"
            v-for="c in categories"
            :key="c.id"
            v-html="marked(c.description)">
          </p>
        </span>

      </b-card>
    </div>
  </div>
</template>

<script>
import marked from 'marked'
import pybossaApi from '@/api/pybossa'
import Loading from '@/components/Loading'

export default {
  data: function () {
    return {
      loading: true,
      categories: [],
      activeCategory: null
    }
  },

  components: {
    Loading
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
        this.loading = false
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
      display: flex;
      flex-direction: column;
      overflow-y: auto;
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
