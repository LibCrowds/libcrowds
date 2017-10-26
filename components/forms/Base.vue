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
          @click="submit">
          <span v-if="!showLoading">{{ submitText }}</span>
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
import 'vue-awesome/icons/circle-o-notch'

export default {
  data () {
    return {
      fakeLoading: false
    }
  },

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
    showLoading () {
      return this.processing || this.fakeLoading
    },

    cardStyle () {
      if (this.noBorder) {
        return {
          border: 'none'
        }
      }
    }
  },

  methods: {
    /**
     * Show the spinner for at least 500ms to avoid ugly flashes of styles.
     */
    submit () {
      this.fakeLoading = true
      setTimeout(() => {
        this.$emit('submit')
        this.fakeLoading = false
      }, 500)
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

  .btn {
    min-width: 120px;
  }

  .sk-three-bounce {
    margin: 0;

    .sk-child {
      background-color: $white;
      width: 0.8rem;
      height: 0.8rem;

      &:nth-child(2) {
        margin-left: 0.2rem;
        margin-right: 0.2rem;
      }
    }
  }
}
</style>
