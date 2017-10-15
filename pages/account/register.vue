<template>
  <div id="register">
    <div class="container my-5">
      <div class="col-lg-8 mx-auto">
        <card-form
          header="Register"
          submit-text="Sign up"
          :form="form"
          :next="next"
          @success="onSuccess">
          <div
            slot="top"
            v-if="auth.facebook || auth.twitter || auth.google">
            <p class="lead text-center">
              Sign up with
            </p>
            <oauth-buttons
              :facebook="auth.facebook"
              :google="auth.google"
              :twitter="auth.twitter"
              :next="next">
            </oauth-buttons>
            <p class="lead text-center mt-2 mb-1">
              or
            </p>
          </div>
          <div slot="footer-left">
            <p class="mb-0 mr-3">
              <small>
                By signing up you are agreeing to the
                <nuxt-link
                  :to="{
                    name: 'help-tos'
                  }">
                  Terms of Service
                </nuxt-link>
                and the
                <nuxt-link
                  :to="{
                    name: 'help-privacy'
                  }">
                  Privacy Policy.
                </nuxt-link>
              </small>
            </p>
          </div>
        </card-form>
      </div>
    </div>
  </div>
</template>

<script>
import localConfig from '@/local.config'
import CardForm from '@/components/forms/CardForm'
import OauthButtons from '@/components/buttons/Oauth'
import pybossa from '@/api/pybossa'

export default {
  layout: 'default',

  async asyncData ({ query }) {
    const [registrationRes, signinRes] = await Promise.all([
      pybossa.getAccountRegistration(),
      pybossa.getAccountSignin()
    ])
    return {
      next: query.next || '/',
      form: {
        endpoint: '/account/register',
        method: 'post',
        model: registrationRes.data.form,
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
              placeholder: 'Choose a password'
            },
            {
              model: 'confirm',
              label: 'Confirm Password',
              type: 'input',
              inputType: 'password',
              placeholder: 'Confirm your password'
            }
          ]
        }
      },
      auth: signinRes.data.auth
    }
  },

  metaInfo () {
    return {
      title: 'Register',
      meta: [
        {
          name: 'description',
          content: `Sign up for a new ${localConfig.brand} account`
        }
      ]
    }
  },

  components: {
    CardForm,
    OauthButtons
  },

  methods: {
    /**
     * Show alert if confirmation is required.
     * @param {Object} data
     *   The response.
     */
    onSuccess (data) {
      if (data.status === 'sent') {
        this.$swal(
          'Confirm your email',
          'To complete your registration please click the confirmation ' +
          'link in the email that we just sent you',
          'success'
        )
      }
    }
  }
}
</script>
