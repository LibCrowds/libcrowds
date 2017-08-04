<template>
  <div id="pybossa-modal-form">
    <b-modal
      ref="child-modal"
      :id="name"
      :title="title"
      @shown="onShown">

      <loading
        v-if="loading"
        text="Loading form">
      </loading>

      <div class="p-2" v-else>

        <b-alert
          show
          :variant="status === 'error' ? 'danger' : status"
          v-for="f in flashMsg"
          :key="f"
          key="flash">
          {{ f }}
        </b-alert>

        <p class="lead text-center" v-if="lead">
          {{ lead }}
        </p>

        <vue-form-generator
          ref="form"
          :schema="schema"
          :model="form"
          :options="formOptions">
        </vue-form-generator>

        <slot></slot>

      </div>

      <template slot="modal-footer">
        <span class="mr-auto">
          <slot name="footer-left"></slot>
        </span>
        <b-button variant="secondary" @click="hide">Close</b-button>
        <b-button variant="success" @click="submit">OK</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import pybossaApi from '@/api/pybossa'
import Loading from '@/components/Loading'

export default {
  name: 'pybossa-modal-form',

  data: function () {
    return {
      form: {},
      status: null,
      flash: '',
      title: '',
      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true
      }
    }
  },

  props: {
    name: {
      type: String,
      required: true
    },
    endpoint: {
      type: String,
      required: true
    },
    schema: {
      type: Object,
      required: true
    },
    lead: String
  },

  components: {
    Loading
  },

  computed: {
    loading () {
      return isEmpty(this.form)
    },

    flashMsg: function () {
      // To handle disappearing and multiple alerts
      return this.flash ? [this.flash] : []
    },

    schemaWithValidators: function () {
      const schema = JSON.parse(JSON.stringify(this.schema))
      schema.fields = this.schema.fields.map(field => {
        field.validator = function (value) {
          return this.form.errors[field]
        }
        return field
      })
      return schema
    }
  },

  methods: {
    /**
     * Load the form when the modal is shown.
     *
     * Done when the modal is shown to ensure we have the latest CSRF token.
     */
    onShown () {
      this.status = null
      this.flash = null
      pybossaApi.get(this.endpoint).then(r => {
        this.form = r.data.form
        this.title = r.data.title
        this.$emit('response', r)
      })
    },

    /**
     * Inject errors into the form generator.
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
     *
     * If successful the modal is hidden, otherwise the flash message and any
     * errors are shown.
     */
    submit () {
      pybossaApi.post(this.endpoint, this.form, {
        headers: {
          'X-CSRFToken': this.form.csrf
        }
      }).then(r => {
        if (r.data.status === 'success') {
          this.hide()
        } else {
          this.flash = r.data.flash
          this.status = r.data.status
          this.injectErrors(r.data.form.errors)
        }
        this.$emit('response', r)
      })
    },

    /**
     * Hide the modal.
     */
    hide () {
      this.$refs['child-modal'].hide()
    }
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/main';

#pybossa-modal-form {
  label {
    display: none !important;
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
