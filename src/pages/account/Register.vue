<template>
  <div id="register">
    <basic-layout
      :navbarSticky="'top'"
      :navbarFixed="null"
      :navbarInvertable="false">
      <div class="container my-3">
        <div class="col-lg-8 offset-lg-2">
          <card-form
            :header="'Regsiter'"
            :lead="lead"
            :submitText="'Sign up'"
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
import config from '@/config'
import pybossaApi from '@/api/pybossa'
import CardForm from '@/components/forms/CardForm'
import BasicLayout from '@/components/layouts/Basic'

export default {
  data: function () {
    return {
      form: {
        endpoint: '/account/register',
        model: {},
        schema: {
          fields: [
            {
              model: 'name',
              label: 'Username',
              type: 'input',
              inputType: 'text',
              placeholder: 'Choose a username'
            },
            {
              model: 'fullname',
              label: 'Full name',
              type: 'input',
              inputType: 'text',
              placeholder: 'Enter your full name'
            },
            {
              model: 'email_addr',
              label: 'Email',
              type: 'input',
              inputType: 'email',
              placeholder: 'you@example.com'
            },
            {
              model: 'password',
              label: 'Password',
              type: 'input',
              inputType: 'password',
              placeholder: 'Create a password'
            },
            {
              model: 'confirm',
              label: 'Password',
              type: 'input',
              inputType: 'password',
              placeholder: 'Confirm your password'
            }
          ]
        }
      },
      auth: {},
      lead: `Create an account for ${config.brand}`
    }
  },

  components: {
    BasicLayout,
    CardForm
  },

  metaInfo: {
    title: 'Register'
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
    pybossaApi.get('/account/register').then(r => {
      next(vm => vm.setData(r.data))
    })
  }
}
</script>
