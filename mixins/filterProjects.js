/**
 * A mixin for filtering projects.
 */
export const filterProjects = {
  data () {
    return {
      filterModel: {}
    }
  },

  computed: {
    filteredProjects () {
      // Check filters
      return this.projects.filter(project => {
        for (let key of Object.keys(this.filterModel)) {
          project.info.filters = project.info.filters || {}
          if (project.info.filters[key] !== this.filterModel[key]) {
            return false
          }
        }
        return true
      })
    }
  },

  methods: {
    /**
     * Set a filter.
     * @param {String} type
     *   The type.
     * @param {String} value
     *   The value.
     */
    updateFilterModel (type, value) {
      this.filterModel[type] = value
      // Create a new object to trigger changes
      this.filterModel = Object.assign({}, this.filterModel)
    },

    clearFilters () {
      this.filterModel = Object.assign({})
    }
  }
}
