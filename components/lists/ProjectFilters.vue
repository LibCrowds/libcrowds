<template>
  <div class="badge-list">
    <b-badge
      v-for="(value, name) in projectFilters"
      :key="name"
      :style="getFilterStyle(name)"
      @click.prevent="handleClick(name, value)">
      {{ name }}: {{ value }}
    </b-badge>
  </div>
</template>

<script>
export default {
  props: {
    projectFilters: {
      type: Object,
      required: true
    },
    collection: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    /**
     * Return the colour of a project filter.
     * @param {String} name
     *   The filter name.
     */
    getFilterStyle (name) {
      const filter = this.collection.info.project_filters.filter(t => {
        return t.name === name
      })[0] || null

      let color = this.darkMode || !filter || !filter.color
        ? '#868e96'
        : filter.color

      return {
        backgroundColor: color,
        cursor: this.disabled ? 'default' : 'pointer'
      }
    },

    /**
     * Handle click.
     * @param {String} name
     *   The filter name.
     * @param {String} value
     *   The filter value.
     */
    handleClick (name, value) {
      if (!this.disabled) {
        this.$emit('click', name, value)
      }
    }
  }
}
</script>
