<template>
  <b-card
    class="card-form"
    :header="header"
    show-footer>

    <b-alert
      show
      :variant="status === 'error' ? 'danger' : status"
      v-for="msg in flashMsg"
      :key="msg"
      key="flash">
      {{ msg }}
    </b-alert>

    <p class="lead text-center" v-if="lead">{{ lead }}</p>

    <slot name="top"></slot>

    <loading
      v-if="loading"
      text="Loading form">
    </loading>

    <vue-form-generator
      v-else
      ref="form"
      :schema="schema"
      :model="model">
    </vue-form-generator>

    <slot name="bottom"></slot>

    <template slot="footer">
      <b-button
        variant="success"
        class="float-right"
        @click="submit">
        {{ submitText }}
      </b-button>
    </template>

  </b-card>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import pybossaApi from '@/api/pybossa'
import Loading from '@/components/Loading'

export default {
  data: function () {
    return {
      status: null,
      flash: ''
    }
  },

  props: {
    endpoint: {
      type: String,
      required: true
    },
    header: {
      type: String,
      required: true
    },
    schema: {
      type: Object,
      required: true
    },
    model: {
      type: Object,
      required: true
    },
    submitText: {
      type: String,
      default: 'Submit'
    },
    lead: {
      type: String,
      required: false
    }
  },

  components: {
    Loading
  },

  computed: {
    loading: function () {
      return isEmpty(this.model)
    },

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
      for (let field of this.schema.fields) {
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
      this.flash = ''
      pybossaApi.post(this.endpoint, this.model, {
        headers: {
          'X-CSRFToken': this.model.csrf
        }
      }).then(r => {
        if (r.data.status !== 'success') {
          this.flash = r.data.flash
          this.status = r.data.status
          this.injectErrors(r.data.form.errors)
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/main';

.card-form {
  label {
    font-weight: 600;
    font-size: $font-size-sm;
  }

  .errors {
    color: $brand-danger;
    font-size: $font-size-sm;

    span {
      margin-top: 0.25rem;
      display: block;
    }
  }
}
</style>
