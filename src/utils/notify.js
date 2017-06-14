import PNotify from 'pnotify'
import 'pnotify/src/pnotify.buttons'
import 'pnotify/src/pnotify.mobile'
import 'vue-awesome/icons/exclamation-circle'
import 'vue-awesome/icons/info-circle'

/*
 * Display a notification.
 */
export default function (msg, type) {
  const opts = {
    title: type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Info',
    text: msg,
    type: type || 'info',
    hide: true,
    width: '400px',
    delay: 2500,
    buttons: {
      closer: true,
      sticker: false,
      closer_hover: false
    },
    mobile: {
      styling: true
    },
    addclass: 'p-sm-4'
  }

  switch (type) {
    case 'message':
      opts.type = 'info'
      break
    case 'error':
    case 'danger':
      opts.type = 'error'
      opts.icon = 'fa fa-exclamation-circle fa-2x'
      opts.hide = false
      break
    case 'warning':
      opts.icon = 'fa fa-exclamation-circle fa-2x'
      break
    case 'success':
      opts.icon = 'fa fa-thumbs-up fa-2x'
      opts.delay = 2000
      break
    default:
      opts.icon = 'fa fa-info-circle fa-2x'
      break
  }
  return new PNotify(opts)
}
