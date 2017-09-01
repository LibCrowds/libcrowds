<template>
  <div id="forgotten-password">
    <div class="container my-5">
      <div class="col-lg-8 offset-lg-2">
        <card-form
          :header="'Forgotten Password'"
          :submitText="'Reset'"
          :form="form">
        </card-form>
      </div>
    </div>
  </div>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import CardForm from '@/components/forms/CardForm'

export default {
  data: function () {
    return {
      form: {
        endpoint: '/account/forgot-password',
        method: 'post',
        model: {},
        schema: {
          fields: [
            {
              model: 'email_addr',
              label: 'Email',
              type: 'input',
              inputType: 'email',
              placeholder: 'you@example.com'
            }
          ]
        }
      }
    }
  },

  components: {
    CardForm
  },

  metaInfo: {
    title: 'Forgotten Password'
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      this.form.model = data.form
    }
  },

  beforeRouteEnter (to, from, next) {
    pybossaApi.get('/account/forgot-password').then(r => {
      next(vm => vm.setData(r.data))
    })
  }
}
</script>
