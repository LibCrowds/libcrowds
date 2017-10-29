import localConfig from '@/local.config'
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
      taskrun: 'task run'
    },
    license: 'CC0',
    presenter: null,
    content: {
      about: `${collection.name} is part of the ${localConfig.brand} ` +
        'crowdsourcing platform, which hosts experimental crowdsourcing ' +
        `projects from ${localConfig.brand}.`,
      data: 'All datasets generated from the experimental crowdsourcing ' +
        'projects hosted on this platform are made available under a CC0 ' +
        'license.\n\nThere are three types of dataset available, all of ' +
        'which can be downloaded in JSON or CSV format:\n\n ' +
        '- **Tasks:** The task data.\n' +
        '- **Task Runs:** The contribution data.\n' +
        '- **Results:** The final results data.\n\n' +
        'We are keen for these datasets to be used in innovative ways, ' +
        'perhaps to further research into new technologies.',
      contribute: ''
    },
    pubished: false,
    tags: []
  }
  collection.info = merge(defaults, collection.info)
}
