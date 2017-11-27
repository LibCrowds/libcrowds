<template>
  <b-btn
    :variant="variant"
    ref="btn">
    {{ btnText }}
  </b-btn>
</template>

<script>
import { notifications } from '@/mixins/notifications'
import Clipboard from 'clipboard'

export default {
  mixins: [ notifications ],

  props: {
    content: {
      type: String,
      default: null
    },
    btnText: {
      type: String,
      default: 'Copy to Clipboard'
    },
    variant: {
      type: String,
      default: 'primary'
    },
    message: {
      type: String,
      default: 'Copied!'
    }
  },

  mounted () {
    const btn = this.$refs.btn
    /* eslint-disable no-new */
    new Clipboard(btn, {
      text: (trigger) => {
        this.notifySuccess({ message: this.message })
        return this.content
      }
    })
  }
}
</script>