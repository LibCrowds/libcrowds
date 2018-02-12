<template>
  <form-base
    class="pybossa-form"
    :show-footer="showFooter"
    :no-body="noBody"
    :show-cancel="showCancel"
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
import { notifications } from '@/mixins/notifications'

export default {
  mixins: [ notifications ],

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
        this.notifyInvalidForm()
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
        data: this.form.model,
        params: this.form.params || {},
        headers: {
          'X-CSRFToken': this.form.model.csrf
        }
      }).then(r => {
        if (r.data.status === 'error' || r.data.status === 'danger') {
          this.alert = r.data.flash
          this.status = r.data.status
          this.notifyInvalidForm()
          this.injectErrors(r.data.form.errors)
          return
        } else if (
          r.data.status === 'success' ||
          r.data.status === 'sent' ||
          !r.data.status
        ) {
          this.handleSuccess(r.data)
        }
        this.flash(r.data)
      }).catch(err => {
        this.notifyError({ message: err.message || 'Server Error' })
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

      if (this.noSubmit) {
        return
      }

      this.$emit('submit', this.form)

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
      })
    },

    /**
     * Emit success and go to next, if present.
     * @param {Object} data
     *   The response data
     */
    handleSuccess (data) {
      if (this.next && this.next.length) {
        this.$router.push({ path: this.next })
      }
      this.$emit('success', data)
    },

    /**
     * Submit the form the event wasn't triggered via a textarea.
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
