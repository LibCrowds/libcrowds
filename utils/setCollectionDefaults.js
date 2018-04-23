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
        'license.\n\n' +
        'We are keen for these datasets to be used in innovative ways, ' +
        'perhaps to further research into new technologies.' +
        '## Project datasets' +
        'There are three types of project dataset available, all of ' +
        'which can be downloaded in JSON or CSV format:\n\n ' +
        '- **Tasks:** The input data for all tasks.\n' +
        '- **Contributions:** The contribution data.\n' +
        '- **Results:** The final results.\n\n' +
        '## Custom datasets' +
        'Custom datasets are configured by administrators and provide a ' +
        'view of all of the final annotations data within the collection.',
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
    volumes: [],
    templates: [],
    export_formats: []
  }
  collection.info = merge(defaults, collection.info)

  // Ensure tags is an array
  if (!Array.isArray(collection.info.tags)) {
    collection.info.tags = []
  }

  // Ensure volumes is an array
  if (!Array.isArray(collection.info.volumes)) {
    collection.info.volumes = []
  }

  // Ensure templates is an array
  if (!Array.isArray(collection.info.templates)) {
    collection.info.templates = []
  }

  // Ensure export_formats is an array
  if (!Array.isArray(collection.info.export_formats)) {
    collection.info.export_formats = []
  }
}
