import Vue from 'vue'
import VueNotifications from 'vue-notifications'
import swal from 'sweetalert2'
import iziToast from 'izitoast'
import capitalize from 'capitalize'

function toast ({title, message, type, timeout, cb}) {
  if (type === VueNotifications.types.warn) type = 'warning'
  iziToast.settings({
    position: 'bottomLeft'
  })
  return iziToast[type]({ title, message, timeout })
}

function sweetalert ({title, message, type, timeout, cb}) {
  if (type === VueNotifications.types.warn) type = 'warning'
  return swal(title, message, type)
}

const options = {
  success: toast,
  error: sweetalert,
  danger: toast,
  info: toast,
  warn: toast
}

Vue.use(VueNotifications, options)

export default ({ req }, inject) => {
  // Inject `notifications` key
  // -> app.$notifications
  // -> this.$notifications in vue components
  // -> this.$notifications in store actions/mutations
  inject('notifications', new Vue({
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
  }))
}
