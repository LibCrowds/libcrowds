import merge from 'lodash/merge'

/**
 * Set the info field defaults for a collection.
 * @param {Array} collection
 *   A PYBOSSA category (used on this platform as a collection).
 */
export const setCollectionDefaults = function (collection) {
  const defaults = {
    forum: null,
    tagline: '',
    background: null,
    terminology: {
      project: 'project',
      task: 'task',
      taskRun: 'task run'
    },
    license: 'CC0',
    presenter: null,
    content: {
      about: '',
      data: '',
      contribute: ''
    },
    pubished: false,
    tags: []
  }
  collection.info = merge(defaults, collection.info)
}
