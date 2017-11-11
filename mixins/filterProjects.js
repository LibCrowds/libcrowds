import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'

/**
 * A mixin for filtering projects.
 */
export const filterProjects = {
  data () {
    return {
      tagModel: {}
    }
  },

  computed: {
    /**
     * Return a filtered Array of projects.
     *
     * All key value pairs in tag model must match the project tags.
     * @param {Object} projects
     *   The projects.
     * @param {Object} filterModel
     *   The filter model.
     */
    filteredProjects () {
      const nonNullTagKeys = Object.keys(pickBy(this.tagModel, identity))
      return this.projects.filter(project => {
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
