<template>
  <b-card
    class="form-base"
    :header="header"
    :show-footer="showFooter"
    :no-body="noBody"
    :style="cardStyle">

    <slot></slot>

    <template slot="footer">
      <span>
        <slot name="footer-left"></slot>
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
    header: {
      type: String,
      default: ''
    },
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
    noBorder: {
      type: Boolean,
      default: false
    },
    noBody: {
      type: Boolean,
      default: false
    },
    processing: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    cardStyle () {
      if (this.noBorder) {
        return {
          border: 'none'
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '~assets/style/settings';

.form-base {
  label {
    font-weight: 600;
    font-size: $font-size-sm;
  }

  .errors {
    color: $red;
    font-size: $font-size-sm;

    span {
      margin-top: 0.25rem;
      display: block;
    }
  }

  fieldset {
    padding: 0;
  }

  .form-group {
    margin-bottom: 2rem;
  }

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
