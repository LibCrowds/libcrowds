<template>
  <div id="notifications">
    <span
      v-if="notification && notification.msg"
      v-html="notify(notification)">
    </span>
  </div>
</template>

<script>
import PNotify from 'pnotify'
import store from '@/store'
import 'pnotify/src/pnotify.mobile'
import 'pnotify/src/pnotify.callbacks'
import 'pnotify/src/pnotify.nonblock'

export default {
  computed: {
    notification: () => store.state.notification
  },

  methods: {
    notify (n) {
      const title = n.type
                      ? n.type.charAt(0).toUpperCase() + n.type.slice(1)
                      : 'Info'
      const opts = {
        title: title,
        text: n.msg,
        type: n.type || 'info',
        hide: true,
        width: '400px',
        delay: 2500,
        mobile: {
          styling: true
        },
        addclass: 'p-sm-4',
        after_close: () => {
          store.commit('DELETE_ITEM', 'notification')
        },
        nonblock: {
          nonblock: true
        }
      }

      switch (opts.type) {
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
@import '~pnotify/src/pnotify.brighttheme';
@import '~pnotify/src/pnotify.nonblock';

.ui-pnotify .ui-pnotify-text {
    word-wrap: break-word;
}

.ui-pnotify-title {
  font-size: 1.2rem;
}
</style>
