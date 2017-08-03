<template>

  <loading
    v-if="loading"
    text="Loading form">
  </loading>

  <form v-on:submit.prevent v-else>

    <b-form-fieldset
      v-for="f in fields"
      :key="f.name"
      :feedback="getErrors(f.name)"
      :state="getState(f.name)">
      <b-form-input
        required
        :type="f.type"
        :placeholder="f.placeholder"
        :state="getState(f.name)"
        v-model="form[f.name]"
        v-on:keyup.enter="submit">
      </b-form-input>
    </b-form-fieldset>

  </form>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import Loading from '@/components/Loading'

export default {
  data: function () {
    return {
      loading: true,
      form: {
        csrf: null,
        errors: {}
      }
    }
  },

  components: {
    Loading
  },

  props: {
    endpoint: {
      type: String,
      required: true
    },
    fields: {
      type: Array,
      required: true
    }
  },

  methods: {
    /**
     * Get the form.
     */
    fetchForm () {
      pybossaApi.get(this.endpoint).then(r => {
        this.form = r.data.form
        this.loading = false
      })
    },

    /**
     * Submit the form, update it and emit the response.
     */
    submit () {
      if (document.querySelector('form').checkValidity()) {
        pybossaApi.post(this.endpoint, this.form, {
          headers: {
            'X-CSRFToken': this.form.csrf
          }
        }).then(r => {
          this.form = r.data.form
          this.$emit('response', r)
        })
      }
    },

    /**
     * Get the errors for a form field.
     * @param {String} field
     *   The form field key.
     * @returns {String}
     *   The feedback.
     */
    getErrors (field) {
      const feedback = this.form.errors[field]
      if (!feedback) {
        return
      }
      return feedback.join()
    },

    /**
     * Return 'danger' if the field has an error, else null.
     * @param {String} field
     *   The form field key.
     * @returns {String|null}
     *   The state class.
     */
    getState (field) {
      return field in this.form.errors ? 'danger' : null
    }
  },

  created () {
    this.fetchForm()
  }
}
</script>
