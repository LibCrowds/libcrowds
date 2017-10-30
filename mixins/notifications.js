import capitalize from 'capitalize'

export const notifications = {
  notifications: {
    notify: {},
    notifySuccess: {
      title: 'Success',
      type: 'success',
      message: ''
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
        this.notify({
          title: capitalize(data.status),
          type: data.status,
          message: data.flash
        })
      }
    }
  }
}
