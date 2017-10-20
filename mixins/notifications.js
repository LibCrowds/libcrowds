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
     * @param {Object} response
     *   The PYBOSSA response.
     */
    flash (response) {
      if (response !== undefined && 'flash' in response.data) {
        this.notify({
          title: capitalize(response.data.status),
          type: response.data.status,
          message: response.data.flash
        })
      }
    }
  }
}
