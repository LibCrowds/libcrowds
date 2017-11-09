<template>
  <b-card id="project-filters-card" header="Filters">
    <div
      v-for="(tag, index) in tags"
      :key="index"
      class="mb-2">
      <label>{{ tag.type }}</label>
      <multiselect
        label="name"
        track-by="name"
        :id="tag"
        :placeholder="`Filter by ${tag.toLowerCase()}`"
        :show-labels="false"
        :options="tag.options"
        @search-change="searchTags"
        @input="onTagChange">
      </multiselect>
    </div>
  </b-card>
</template>

<script>

export default {
  data () {
    return {
      filters: {}
    }
  },

  props: {
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
    tags () {
      return this.collection.info.tags || []
    }
  },

  methods: {
    /**
     * Search the available project tags.
     */
    searchTags (query) {

    },

    /**
     * Handle a tag being selected or removed.
     * @param {Object} tag
     *   The tag.
     * @param {Object} key
     *   The multiselect component ID (which should be the tag key).
     */
    onTagChange (tag, key) {
      delete this.filters[key]
      if (tag) {
        this.filters[key] = tag.name
      }
      this.$emit('change', this.getFiltered())
    },

    /**
     * Get filtered projects.
     */
    getFiltered () {
      const keys = Object.keys(this.filters)
      return this.projects.filter(project => {
        for (let key of keys) {
          if (project.info[key] !== this.filters[key]) {
            return false
          }
        }
        return true
      })
    }
  },

  watch: {
    projects () {
      this.$emit('change', this.getFiltered())
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

  #show-completed {
    label {
      margin: 0 5px 0 0;
    }
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>