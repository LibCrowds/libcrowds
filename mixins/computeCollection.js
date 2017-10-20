import merge from 'lodash/merge'

export const computeCollection = {
  computed: {
    collection () {
      const collection = this.category
      const defaultInfo = {
        forumUrl: null,
        tagline: null,
        bgImg: null,
        terminology: {
          category: 'category',
          project: 'project',
          task: 'task',
          taskRun: 'task run'
        }
      }

      collection.info = merge(collection.info, defaultInfo)
      return collection
    }
  }
}
