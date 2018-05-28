<template>
  <form-base
    class="pybossa-form"
    :show-footer="showFooter"
    :no-body="noBody"
    :show-cancel="showCancel"
    :show-submit="showSubmit"
    :cancel-text="cancelText"
    :processing="processing"
    :submit-text="submitText"
    @submit="submit"
    @cancel="$emit('cancel')">

    <b-alert
      show
      :variant="status === 'error' ? 'danger' : status"
      v-for="msg in alertMsg"
      class="mb-1"
      :key="msg">
      {{ msg }}
    </b-alert>

    <p class="lead text-center" v-if="lead">{{ lead }}</p>

    <slot name="top"></slot>

    <vue-form-generator
      ref="form"
      :class="darkMode ? 'form-dark' : null"
      :schema="form.schema"
      :model="form.model">
    </vue-form-generator>

    <slot name="bottom"></slot>

    <template slot="footer-base-left">
      <slot name="footer-left"></slot>
    </template>

  </form-base>
</template>

<script>
import FormBase from '@/components/forms/Base'

export default {
  data () {
    return {
      status: null,
      alert: '',
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
    submitText: {
      type: String,
      default: 'Submit'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    lead: {
      type: String,
      required: false
    },
    showCancel: {
      type: Boolean,
      default: false
    },
    showSubmit: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    noSubmit: {
      type: Boolean,
      default: false
    },
    next: {
      type: String,
      default: ''
    },
    noBody: {
      type: Boolean,
      default: false
    },
    confirmation: {
      type: String,
      required: false
    },
    formKey: {
      type: String,
      default: 'form'
    }
  },

  computed: {
    alertMsg () {
      // To handle disappearing and multiple alerts
      return this.alert ? [this.alert] : []
    },
    cardStyle () {
      if (this.noBorder) {
        return {
          border: 'none'
        }
      }
    }
  },

  components: {
    FormBase
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
     * Validate the form.
     */
    isValid () {
      const valid = this.$refs.form.validate()
      if (!valid) {
        this.alert = 'Please correct the errors'
        this.status = 'error'
        this.$notifications.invalidForm()
      }
      return valid
    },

    /**
     * Process and submit the form.
     */
    process () {
      this.processing = true
      this.alert = ''

      return this.$axios({
        method: this.form.method,
        url: this.form.endpoint,
        data: this.getModel(),
        params: this.form.params || {},
        headers: {
          'X-CSRFToken': this.form.model.csrf
        }
      }).then(r => {
        this.$emit('response', r.data)
        if (r.data.status === 'error' || r.data.status === 'danger') {
          this.alert = r.data.flash
          this.status = r.data.status
          this.$notifications.invalidForm()
          this.injectErrors(r.data[this.formKey].errors)
          return
        } else if (
          r.data.status === 'success' ||
          r.data.status === 'sent' ||
          !r.data.status
        ) {
          this.handleSuccess(r.data)
        }
        this.$notifications.flash(r.data)
      }).catch(err => {
        this.$nuxt.error(err)
      }).then(() => {
        this.processing = false
      })
    },

    /**
     * Submit the form.
     */
    submit () {
      if (!this.isValid()) {
        return
      }

      this.$emit('submit', this.form.model)

      if (this.noSubmit) {
        return
      }

      if (!this.confirmation) {
        this.process()
        return
      }

      this.$swal({
        title: `Confirm`,
        html: this.confirmation,
        type: 'question',
        showCancelButton: true,
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this.process()
        }
      }).catch(err => {
        if (typeof err === 'object' && err.hasOwnProperty('dismiss')) {
          this.$nuxt.error(err)
        }
      })
    },

    /**
     * Return the form model after converting any multiselect fields.
     */
    getModel () {
      const modelCopy = JSON.parse(JSON.stringify(this.form.model))
      const multiselectFields = this.form.schema.fields.filter(field => {
        return field.type === 'vueMultiSelect'
      })

      for (let field of multiselectFields) {
        let value = modelCopy[field.model]
        if (Array.isArray(value)) {
          modelCopy[field.model] = value.map(item => (item.id))
        } else if (value) {
          modelCopy[field.model] = value.id
        }
      }
      return modelCopy
    },

    /**
     * Emit success and go to next, if present.
     * @param {Object} data
     *   The response data
     */
    handleSuccess (data) {
      if (typeof this.next === 'string' && this.next.length) {
        this.$router.push({ path: this.next })
      }
      this.$emit('success', data)
    },

    /**
     * Submit the form if the event wasn't triggered via a textarea.
     * @param {Object} evt
     *   The event.
     */
    handleKeyup (evt) {
      if (evt.keyCode === 13 && evt.target.type !== 'textarea') {
        this.submit()
      }
    }
  },

  mounted () {
    this.$refs.form.$el.addEventListener('keypress', this.handleKeyup)
  },

  beforeDestroy () {
    this.$refs.form.$el.removeEventListener('keypress', this.handleKeyup)
  }
}
</script>
