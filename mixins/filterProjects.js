/**
 * A mixin for filtering projects.
 */
export const filterProjects = {
  data () {
    return {
      showCompleted: true,
      tagModel: {}
    }
  },

  computed: {
    filteredProjects () {
      // Check tags
      let filtered = this.projects.filter(project => {
        for (let key of Object.keys(this.tagModel)) {
          project.info.tags = project.info.tags || {}
          if (project.info.tags[key] !== this.tagModel[key]) {
            return false
          }
        }
        return true
      })

      if (this.showCompleted) {
        return filtered
      }

      // Filter completed
      return filtered.filter(project => {
        return project.overall_progress < 100
      })
    }
  },

  methods: {
    /**
     * Set a tag type in the tag model.
     * @param {String} type
     *   The type.
     * @param {String} value
     *   The value.
     */
    updateTagModel (type, value) {
      this.tagModel[type] = value
      // Create a new object to trigger changes
      this.tagModel = Object.assign({}, this.tagModel)
    },

    clearFilters () {
      this.tagModel = Object.assign({})
    }
  }
}
