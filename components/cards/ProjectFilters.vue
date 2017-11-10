<template>
  <b-card id="project-filters-card" header="Filters">
    <div
      v-for="(value, tag) in collection.info.tags"
      :key="tag"
      class="mb-2">
      <label>{{ tag }}</label>
      <multiselect
        :placeholder="`Filter by ${tag.toLowerCase()}`"
        :show-labels="false"
        :options="value.options"
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

  methods: {
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
      return this.projects.filter(project => {
        const projectTags = project.info.tags || {}
        for (let key of Object.keys(this.filters)) {
          if (
            !projectTags.hasOwnProperty(key) ||
            projectTags[key] !== this.filters[key]
          ) {
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
}
</style>