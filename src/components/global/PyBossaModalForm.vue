<template>
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
        :schema="schema"
        :model="form">
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
      title: ''
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

<style lang="scss" scoped>
label {
  display: none !important;
}
</style>
