<template>
  <div id="notifications">
    <span v-if="notification">
      {{ notify(notification.msg, notification.type) }}
    </span>
  </div>
</template>

<script>
import PNotify from 'pnotify'
import store from '@/store'
import 'pnotify/src/pnotify.buttons'
import 'pnotify/src/pnotify.mobile'
import 'pnotify/src/pnotify.callbacks'

export default {
  computed: {
    notification: () => store.state.notification
  },

  methods: {
    notify (msg, type) {
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
        addclass: 'p-sm-4',
        after_close: () => {
          store.commit('SET_NOTIFICATION', null)
        }
      }

      switch (type) {
        case 'message':
          opts.type = 'info'
          break
        case 'error':
        case 'danger':
          opts.type = 'error'
          opts.delay = 5000
          break
        default:
          break
      }

      /* eslint-disable no-new */
      new PNotify(opts)
    }
  }
}
</script>

<style lang="scss">
@import '~pnotify/src/pnotify';
@import '~pnotify/src/pnotify.mobile';
@import '~pnotify/src/pnotify.buttons';
@import '~pnotify/src/pnotify.brighttheme';

.ui-pnotify .ui-pnotify-text {
    word-wrap: break-word;
}

.ui-pnotify-title {
  font-size: 1.2rem;
}
</style>
