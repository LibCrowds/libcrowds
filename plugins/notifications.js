import Vue from 'vue'
import VueNotifications from 'vue-notifications'
import swal from 'sweetalert2'
import iziToast from 'izitoast'

function toast ({title, message, type, timeout, cb}) {
  if (type === VueNotifications.types.warn) type = 'warning'
  iziToast.settings({
    position: 'bottomLeft'
  })
  return iziToast[type]({title, message, timeout})
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
