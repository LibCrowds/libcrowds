<template>
  <b-modal
    ref="modal"
    :id="modalId"
    :title="title"
    :size="size"
    @ok="submit"
    :header-text-variant="darkMode ? 'white' : null"
    :header-bg-variant="darkMode ? 'dark' : null"
    :body-bg-variant="darkMode ? 'dark' : null"
    :body-text-variant="darkMode ? 'white' : null"
    :footer-bg-variant="darkMode ? 'dark' : null"
    :footer-text-variant="darkMode ? 'white' : null"
    @hidden="$emit('hidden')"
    @shown="onShown">

    <slot></slot>

    <form-base
      class="pybossa-form"
      :show-footer="false">

      <vue-form-generator
        ref="form"
        :class="darkMode ? 'form-dark' : null"
        :schema="form.schema"
        :model="form.model">
      </vue-form-generator>

    </form-base>
  </b-modal>
</template>

<script>
import FormBase from '@/components/forms/Base'

export default {
  props: {
    form: {
      type: Object,
      required: true,
      validator: value => {
        return (
          'model' in value &&
          'schema' in value
        )
      }
    },
    title: {
      type: String,
      required: true
    },
    modalId: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: 'md'
    }
  },

  components: {
    FormBase
  },

  methods: {
    /**
     * Submit the form.
     */
    submit (evt) {
      evt.preventDefault()
      if (!this.$refs.form.validate()) {
        this.$notifications.invalidForm()
        return
      }
      this.$emit('submit', this.form)
      this.$refs.modal.hide()
    },

    /**
     * Handle modal shown.
     */
    onShown () {
      this.$refs.modal.$el.querySelector('.form-control').focus()
      this.$emit('shown')
    },

    /**
     * Submit the form if the event wasn't triggered via a textarea.
     * @param {Object} evt
     *   The event.
     */
    handleKeyup (evt) {
      if (evt.keyCode === 13 && evt.target.type !== 'textarea') {
        this.submit(evt)
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

<style>
.form-base .form-group {
  margin-bottom: 1rem;
}
</style>
