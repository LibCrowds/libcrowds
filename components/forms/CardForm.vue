<template>
  <b-card
    class="card-form"
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

  computed: {
    flashMsg: function () {
      // To handle disappearing and multiple alerts
      return this.flash ? [this.flash] : []
    }
  },

  methods: {
    /**
     * Inject errors into the form generator.
     * @param {Object} errors
     *   The form errors.
     */
    injectErrors (errors) {
      this.$refs.form.errors = []
      for (let field of this.form.schema.fields) {
        if (field.model in errors) {
          for (let error of errors[field.model]) {
            this.$refs.form.errors.push({
              error,
              field
            })
          }
        }
      }
    },

    /**
     * Submit the form.
     */
    submit () {
      this.processing = true
      this.$emit('submit', this.form)
      if (this.noSubmit) {
        return
      }

      this.flash = ''
      this.$pybossa.client({
        method: this.form.method,
        url: this.form.endpoint,
        data: this.form.model,
        params: this.form.params || {},
        headers: {
          'X-CSRFToken': this.form.model.csrf
        }
      }).then(r => {
        this.processing = false
        if (r.data.status === 'error') {
          this.flash = r.data.flash
          this.status = r.data.status
          this.injectErrors(r.data.form.errors)
        } else {
          this.handleSuccess(r.data)
        }
      }).catch(err => {
        this.processing = false
        this.flash = err.response.data.exception_msg
        this.status = 'error'
      })
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

.card-form {
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
