<template>

  <loading
    v-if="loading"
    text="Loading form">
  </loading>

  <form v-on:submit.prevent v-else>

    <b-form-fieldset
      v-for="f in fields"
      :key="f.name"
      :feedback="getFeedback(f.name)"
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
import router from '@/router'
import Loading from '@/components/Loading'

export default {
  data: function () {
    return {
      loading: true,
      form: {
        csrf: null,
        email: null,
        errors: {},
        password: null
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
    fetch () {
      pybossaApi.get(this.endpoint).then(r => {
        this.handleResponse(r)
        this.loading = false
      })
    },
    submit () {
      if (document.querySelector('form').checkValidity()) {
        pybossaApi.post(this.endpoint, this.form, {
          headers: {
            'X-CSRFToken': this.form.csrf
          }
        }).then(r => {
          this.handleResponse(r)
        })
      }
    },
    handleResponse (r) {
      if ('next' in r.data) {
        router.push({ path: r.data.next })
      }
      this.form = r.data.form
      this.$emit('response', r)
    },
    getFeedback (field) {
      const fb = this.form.errors[field]
      if (!fb) {
        return
      }
      return fb.join()
    },
    getState (field) {
      return field in this.form.errors ? 'danger' : null
    }
  },

  mounted () {
    this.fetch()
  }
}
</script>
