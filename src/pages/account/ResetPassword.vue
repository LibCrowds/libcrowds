<template>
  <div id="reset-password">
    <basic-layout
      :navbarSticky="true"
      :navbarFixed="null"
      :navbarInvertable="false">
      <div class="container my-5">
        <div class="col-lg-8 offset-lg-2">
          <card-form
            :header="'Reset Password'"
            :lead="lead"
            :submitText="'Reset'"
            :endpoint="form.endpoint"
            :schema="form.schema"
            :model="form.model">
          </card-form>
        </div>
      </div>
    </basic-layout>
  </div>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import CardForm from '@/components/forms/CardForm'
import BasicLayout from '@/components/layouts/Basic'

export default {
  data: function () {
    return {
      form: {
        endpoint: '/account/reset-password',
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
    BasicLayout,
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
