<template>
  <b-card class="form-container form-base" :no-body="noBody">

    <slot></slot>

    <template v-if="showFooter" slot="footer">
      <span>
        <slot name="footer-base-left"></slot>
      </span>
      <span>
        <b-btn
          v-if="showCancel"
          variant="outline-dark"
          :disabled="processing"
          class="mr-1"
          @click="$emit('cancel')">
          {{ cancelText }}
        </b-btn>
        <b-btn
          variant="success"
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
      default: true
    }
  }
}
</script>

<style lang="scss">
@import '~assets/style/settings';
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
