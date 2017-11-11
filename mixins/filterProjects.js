import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'

/**
 * A mixin for filtering projects.
 */
export const filterProjects = {
  data () {
    return {
      showCompleted: false,
      tagModel: {}
    }
  },

  computed: {
    filteredProjects () {
      // Check tags
      const nonNullTagKeys = Object.keys(pickBy(this.tagModel, identity))
      let filtered = this.projects.filter(project => {
        for (let key of nonNullTagKeys) {
          if (
            !project.info.tags ||
            project.info.tags[key] !== this.tagModel[key]
          ) {
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
    }
  }
}
