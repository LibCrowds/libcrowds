<template>
  <div class="filter-projects-data">
    <div
      v-for="(filter, index) in collection.info.project_filters"
      :key="index"
      class="mb-2">
      <label for="Language" class="sr-only">{{ filter.name }}</label>
      <multiselect
        :id="filter.name"
        v-model="model[filter.name]"
        :placeholder="`Filter by ${filter.name.toLowerCase()}`"
        :show-labels="false"
        :show-no-results="false"
        :options="options[filter.name] || []"
        @input="onInput"
        @select="onSelect">
      </multiselect>
    </div>
  </div>
</template>

<script>
import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'

export default {
  data () {
    return {
      model: this.value,
      options: {}
    }
  },

  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    collection: {
      type: Object,
      required: true
    },
    hideLabel: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    /**
     * Handle a filter being selected or removed.
     * @param {String} value
     *   The filter value.
     * @param {String} name
     *   The filter name (which comes from the multiselect component ID).
     */
    onInput (value, name) {
      this.model[name] = value
      // Emit with null values removed
      this.$emit('input', pickBy(this.model, identity))
    },

    /**
     * Handle a filter being selected.
     * @param {String} value
     *   The filter name.
     * @param {String} name
     *   The filter name (which comes from the multiselect component ID).
     */
    onSelect (value, typnamee) {
      this.$emit('select', value, name)
    }
  },

  mounted () {
    // Get all current filters for the collection.
    const catShortName = this.collection.short_name
    const endpoint = `/lc/categories/${catShortName}/project-filters`
    return this.$axios.$get(endpoint).then(data => {
      this.options = data.filters
    }).catch(err => {
      this.$nuxt.error(err)
    })
  },

  watch: {
    value (val) {
      this.model = val
    }
  }
}
</script>
