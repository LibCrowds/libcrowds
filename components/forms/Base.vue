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
          class="mr-1"
          @click="$emit('cancel')">
          {{ cancelText }}
        </b-btn>
        <b-btn
          variant="success"
          @click="$emit('submit')">
          <span v-if="!processing">{{ submitText }}</span>
          <div v-else class="sk-three-bounce">
            <div class="sk-child sk-bounce1"></div>
            <div class="sk-child sk-bounce2"></div>
            <div class="sk-child sk-bounce3"></div>
          </div>
        </b-btn>
      </span>
    </template>

  </b-card>
</template>

<script>

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
@import '~spinkit/scss/spinners/7-three-bounce';

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

  .card-footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .sk-three-bounce {
    margin: 0;

    .sk-child {
      background-color: $white;
      width: 0.8rem;
      height: 0.8rem;
    }
  }
}
</style>
