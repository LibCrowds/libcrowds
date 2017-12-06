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
    presenter_options: {
      note_button: 'Add a note',
      submit_button: 'Save',
      share_text: ''
    },
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
        'You can also generate a project report in CSV format that contains ' +
        'some project and user statistics.\n\n' +
        'We are keen for these datasets to be used in innovative ways, ' +
        'perhaps to further research into new technologies.',
      projects: ''
    },
    pubished: false,
    celebrations: {
      confetti: 'heart',
      user: '# Horay!\n\n' +
        'You have completed all available tasks for this project.\n\n' +
        'As we are asking for more than one person to complete each task, ' +
        'we still need more contributions before the project is marked as ' +
        'complete, so please spread the word!',
      project: '# Project Complete!\n\n' +
        'This project is now complete.\n\n The data will be processed ' +
        'and used to directly enabled future research.'
    },
    volumes: {},
    templates: {}
  }
  collection.info = merge(defaults, collection.info)

  // Handle old tag structure
  if (Array.isArray(collection.info.tags)) {
    convertOldTagStructure(collection)
  } else if (!collection.info.tags) {
    collection.info.tags = {}
  }
}

/**
 * Convert the pre 1.0.0 data structure for tags.
 * @param {Object} collection
 *   The collection.
 */
function convertOldTagStructure (collection) {
  const newTags = {}
  const uniqueTypes = [...new Set(collection.info.tags.map(tag => tag.type))]
  for (let type of uniqueTypes) {
    newTags[type] = {
      color: '#2589BD',
      options: collection.info.tags.filter(tag => {
        return tag.type === type
      }).map(tag => {
        return tag.name
      })
    }
  }
  collection.info.tags = newTags
}
