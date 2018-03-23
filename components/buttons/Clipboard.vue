<template>
  <b-btn
    :variant="variant"
    ref="btn">
    {{ btnText }}
  </b-btn>
</template>

<script>
import ClipboardJS from 'clipboard'

export default {
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
    new ClipboardJS(btn, {
      text: (trigger) => {
        this.$notifications.success({ message: this.message })
        return this.content
      }
    })
  }
}
</script>