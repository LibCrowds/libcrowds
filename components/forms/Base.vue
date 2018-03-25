<template>
  <b-card
    :class="cardClass"
    :no-body="noBody"
    :bg-variant="darkMode ? 'dark' : null"
    :text-variant="darkMode ? 'white' : null">

    <slot></slot>

    <template v-if="showFooter" slot="footer">
      <span>
        <slot name="footer-base-left"></slot>
      </span>
      <span>
        <b-btn
          v-if="showCancel"
          :variant="darkMode ? 'secondary': 'outline-dark'"
          :disabled="processing"
          class="mr-1"
          @click="$emit('cancel')">
          {{ cancelText }}
        </b-btn>
        <b-btn
          :variant="darkMode ? 'dark': 'success'"
          :disabled="processing"
          @click="$emit('submit')">
          {{ submitText }}
        </b-btn>
      </span>
    </template>

  </b-card>
</template>

<script>
import 'vue-awesome/icons/circle-o-notch'

export default {
  props: {
    submitText: {
      type: String,
      default: 'Submit'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    showCancel: {
      type: Boolean,
      default: false
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    noBody: {
      type: Boolean,
      default: false
    },
    processing: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    cardClass () {
      return {
        'form-container': true,
        'form-base': true,
        'form-dark': this.darkMode
      }
    }
  }
}
</script>

<style lang="scss">
.form-base {
  .btn {
    transition: 250ms opacity;
  }

  .card-footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
