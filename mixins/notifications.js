import capitalize from 'capitalize'

export const notifications = {
  notifications: {
    notify: {
      iconText: '\u2139'
    },
    notifySuccess: {
      title: 'Success',
      type: 'success'
    },
    notifyWarn: {
      title: 'Warning',
      type: 'warn'
    },
    notifyInfo: {
      title: 'Info',
      type: 'info'
    },
    notifyError: {
      title: 'Error',
      type: 'error'
    },
    notifyInvalidForm: {
      title: 'Invalid form data',
      type: 'warn',
      message: 'Please correct the errors'
    },
    notifyAnswerSaved: {
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
      if (data !== undefined && 'flash' in data) {
        if (data.status === 'success') {
          this.notifySuccess({ message: data.flash })
        } else if (data.status === 'warning') {
          this.notifyWarn({ message: data.flash })
        } else if (data.status === 'info') {
          this.notifyInfo({ message: data.flash })
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
