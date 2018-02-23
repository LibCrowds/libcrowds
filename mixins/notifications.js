import capitalize from 'capitalize'

export const notifications = {
  notifications: {
    notify: {},
    success: {
      title: 'Success',
      type: 'success'
    },
    warn: {
      title: 'Warning',
      type: 'warn'
    },
    info: {
      title: 'Info',
      type: 'info'
    },
    error: {
      title: 'Error',
      type: 'error'
    },
    invalidForm: {
      title: 'Invalid form data',
      type: 'warn',
      message: 'Please correct the errors'
    },
    answerSaved: {
      title: 'Answer saved',
      type: 'success',
      message: 'Thank you for your contribution!'
    }
  },

  methods: {
    /**
     * Handle flash messages.
     * @param {Object} data
     *   The response data.
     */
    flash (data) {
      if (process.browser && data !== undefined && 'flash' in data) {
        if (data.status === 'success') {
          this.success({ message: data.flash })
        } else if (data.status === 'warning') {
          this.warn({ message: data.flash })
        } else if (data.status === 'info' || data.status === 'message') {
          this.info({ message: data.flash })
        } else {
          this.notify({
            title: capitalize(data.status),
            type: data.status,
            message: data.flash
          })
        }
      }
    }
  }
}
