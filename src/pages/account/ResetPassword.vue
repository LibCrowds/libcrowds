<template>
  <div id="reset-password">
    <div class="container my-5">
      <div class="col-lg-8 offset-lg-2">
        <card-form
          :header="'Reset Password'"
          :lead="lead"
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
        endpoint: '/account/reset-password',
        method: 'post',
        model: {},
        schema: {
          fields: [
            {
              model: 'new_password',
              label: 'New Password',
              type: 'input',
              inputType: 'password',
              placeholder: 'Choose a new password'
            },
            {
              model: 'confirm',
              label: 'Confirm Password',
              type: 'input',
              inputType: 'password',
              placeholder: 'Confirm your new password'
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
    title: 'Reset Password'
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
    pybossaApi.get('/account/reset-password').then(r => {
      next(vm => vm.setData(r.data))
    })
  }
}
</script>
