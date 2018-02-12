<template>
  <b-modal
    ref="modal"
    :id="modalId"
    :title="title"
    @ok="submit"
    :header-bg-variant="darkMode ? 'dark' : null"
    :body-bg-variant="darkMode ? 'dark' : null"
    :footer-bg-variant="darkMode ? 'dark' : null"
    @hidden="$emit('hidden')"
    @shown="onShown">

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
import { notifications } from '@/mixins/notifications'

export default {
  mixins: [ notifications ],

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
        this.notifyInvalidForm()
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
    }
  }
}
</script>

<style>
.form-base .form-group {
  margin-bottom: 1rem;
}
</style>
