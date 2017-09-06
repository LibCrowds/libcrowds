<template>
  <div id="register">
    <div class="container my-5">
      <div class="col-lg-8 offset-lg-2">
        <card-form
          :header="'Regsiter'"
          :lead="lead"
          :submitText="submitText"
          :form="form">

          <div slot="footer-left">
            <p class="mb-0 mr-3">
              <small>
                By clicking on "{{ submitText }}" you are agreeing to
                the
                <router-link
                  :to="{
                    name: 'help-tos'
                  }">
                  Terms of Service
                </router-link>
                and the
                <router-link
                  :to="{
                    name: 'help-privacy'
                  }">
                  Privacy Policy.
                </router-link>
              </small>
            </p>
          </div>

        </card-form>
      </div>
    </div>
  </div>
</template>

<script>
import siteConfig from '@/siteConfig'
import pybossaApi from '@/api/pybossa'
import CardForm from '@/components/forms/CardForm'

export default {
  data: function () {
    return {
      submitText: 'Sign up',
      form: {
        endpoint: '/account/register',
        method: 'post',
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
      lead: `Create an account for ${siteConfig.brand}`
    }
  },

  metaInfo () {
    return {
      title: 'Register',
      description: `Sign up for a new ${siteConfig.brand} account`
    }
  },

  components: {
    CardForm
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
