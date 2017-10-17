<template>
  <b-card
    class="firebase-form"
    :header="header"
    show-footer>

    <b-alert
      show
      :variant="status === 'error' ? 'danger' : status"
      v-for="msg in flashMsg"
      class="mb-1"
      :key="msg">
      {{ msg }}
    </b-alert>

    <p class="lead text-center" v-if="lead">{{ lead }}</p>

    <slot name="top"></slot>

    <vue-form-generator
      ref="form"
      :schema="form.schema"
      :model="form.model">
    </vue-form-generator>

    <slot name="bottom"></slot>

    <template slot="footer">
      <span>
        <slot name="footer-left"></slot>
      </span>
      <span>
        <b-btn
          v-if="showCancel"
          variant="outline-dark"
          @click="cancel">
          Cancel
        </b-btn>
        <b-btn
          variant="success"
          @click="submit">
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
  data: function () {
    return {
      status: null,
      flash: '',
      processing: false
    }
  },

  props: {
    form: {
      type: Object,
      required: true,
      validator: value => {
        return (
          'endpoint' in value &&
          'method' in value &&
          'model' in value &&
          'schema' in value
        )
      }
    },
    header: {
      type: String,
      required: true
    },
    submitText: {
      type: String,
      default: 'Submit'
    },
    lead: {
      type: String,
      required: false
    },
    showCancel: {
      type: Boolean,
      default: false
    },
    noSubmit: {
      type: Boolean,
      default: false
    },
    next: {
      type: String,
      default: null
    }
  },

  methods: {
    /**
     * Submit the form.
     */
    submit () {
      // TODO
    },

    /**
     * Emit success and go to next, if present.
     * @param {Object} data
     *   The response data
     */
    handleSuccess (data) {
      if (this.next) {
        this.$router.push({ path: this.next })
      }
      this.$emit('success', data)
    },

    /**
     * Cancel the form submission.
     */
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss">
@import '~assets/style/main';
@import '~spinkit/scss/spinners/7-three-bounce';

.firebase-form {
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
