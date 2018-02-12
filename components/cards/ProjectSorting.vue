<template>
  <b-card
    id="project-filters-card"
    header="Sorting Options"
    :bg-variant="darkMode ? 'dark' : 'light'"
    :text-variant="darkMode ? 'white' : null">

    <div
      v-for="(value, tag) in collection.info.tags"
      :key="tag"
      class="mb-2">
      <label>{{ tag }}</label>
      <multiselect
        :id="tag"
        :placeholder="`Filter by ${tag.toLowerCase()}`"
        :show-labels="false"
        :options="value.options"
        @input="onFilterChange">
      </multiselect>
    </div>

    <div class="mb-2">
      <label>Sort by</label>
      <multiselect
        label="name"
        track-by="name"
        v-model="mergedSortModel"
        placeholder="Sort projects by"
        :show-labels="false"
        :options="sortOptions"
        @input="onSortChange">
      </multiselect>
    </div>

  </b-card>
</template>

<script>
import merge from 'lodash/merge'

export default {
  data () {
    return {
      sortOptions: [
        {
          name: 'Most Tasks',
          sortBy: 'n_tasks',
          sortDesc: true
        },
        {
          name: 'Least Tasks',
          sortBy: 'n_tasks',
          sortDesc: false
        },
        {
          name: 'Most Popular',
          sortBy: 'n_volunteers',
          sortDesc: true
        },
        {
          name: 'Least Popular',
          sortBy: 'n_volunteers',
          sortDesc: false
        },
        {
          name: 'Most Complete',
          sortBy: 'overall_progress',
          sortDesc: true
        },
        {
          name: 'Least Complete',
          sortBy: 'overall_progress',
          sortDesc: false
        }
      ],
      initialSortModel: {
        name: 'Least Complete',
        sortBy: 'overall_progress',
        sortDesc: false
      },
      initialFilterModel: {}
    }
  },

  props: {
    sortModel: {
      type: Object,
      default: () => ({})
    },
    filterModel: {
      type: Object,
      default: () => ({})
    },
    projects: {
      type: Array,
      required: true
    },
    collection: {
      type: Object,
      required: true
    }
  },

  computed: {
    mergedSortModel: {
      get () {
        return merge({}, this.initialSortModel, this.sortModel)
      },
      set (newValue) {
        this.initialSortModel = newValue
      }
    },

    mergedFilterModel: {
      get () {
        return merge({}, this.initialFilterModel, this.filterModel)
      },
      set (newValue) {
        this.initialFilterModel = newValue
      }
    }
  },

  methods: {
    /**
     * Handle a tag being selected or removed.
     * @param {Object} name
     *   The tag name.
     * @param {Object} type
     *   The tag type (which comes from the multiselect component ID).
     */
    onFilterChange (name, type) {
      this.$emit('filter-change', name, type)
    },

    /**
     * Handle sort change.
     * @param {Object} value
     *   The sorting option.
     */
    onSortChange (value) {
      this.$emit('sort-change', value)
    }
  }
}
</script>

<style lang="scss">
@import '~assets/style/settings';

#project-filters-card {
  font-size: $font-size-sm;
  margin-top: 0;

  .card-header {
    background-color: $gray-100;
    text-align: center;
    padding: $list-group-item-padding-y $list-group-item-padding-x;
  }
}
</style>