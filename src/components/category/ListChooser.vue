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
            @click.native="onCategoryClick(c)">
            {{ c.name }}
          </b-list-group-item>
        </b-list-group>
      </b-card>
    </div>
    <div class="col-md-8">
      <b-card>
        <transition-group name="descriptions" tag="p">
        <span
          v-for="c in categories"
          :key="c.id"
          v-show="activeCategory === c">
          {{ c.description }}
        </span>
        </transition-group>
      </b-card>
    </div>
  </div>
</template>

<script>
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
        this.activeCategory = this.categories[0]
      })
    },

    /**
     * Handle a category item click.
     */
    onCategoryClick (category) {
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
  }

  #categories-card {
    .card-block {
      padding: 0;
      overflow: scroll;

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

.descriptions-item {
  position: absolute;
}
.descriptions-enter-active,
.descriptions-leave-active {
  transition: all 200ms;
}
.descriptions-enter,
.descriptions-leave-to {
  opacity: 0;
}
</style>
