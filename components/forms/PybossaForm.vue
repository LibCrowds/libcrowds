<template>
  <form-base
    class="pybossa-form"
    :header="header"
    :show-footer="showFooter"
    :no-body="noBody"
    :no-border="noBorder"
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
      :schema="form.schema"
      :model="form.model">
    </vue-form-generator>

    <slot name="bottom"></slot>

  </form-base>
</template>

<script>
import FormBase from '@/components/forms/Base'
import { notifications } from '@/mixins/notifications'

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
    noBorder: {
      type: Boolean,
      default: false
    },
    noBody: {
      type: Boolean,
      default: false
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
     * Submit the form.
     */
    submit () {
      this.processing = true
      this.$emit('submit', this.form)
      if (this.noSubmit) {
        return
      }

      this.alert = ''
      this.$axios({
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
          this.alert = r.data.flash
          this.status = r.data.status
          this.injectErrors(r.data.form.errors)
        } else {
          this.handleSuccess(r.data)
          this.flash(r.data)
        }
      }).catch(err => {
        this.notify({
          type: 'error',
          title: 'Error',
          message: err.message || 'Server Error'
        })
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
    }
  },

  mixins: [ notifications ]
}
</script>
