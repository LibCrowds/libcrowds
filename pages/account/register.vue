<template>
  <div id="register">
    <div class="container my-5">
      <div class="col-lg-8 mx-auto">
        <card-form
          header="Register"
          submit-text="Sign up"
          :form="form"
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
import swal from 'sweetalert2'
import localConfig from '@/local.config'
import CardForm from '@/components/forms/CardForm'
import OauthButtons from '@/components/buttons/Oauth'
import pybossa from '@/api/pybossa'

export default {
  layout: 'default',

  async asyncData () {
    const [registrationResponse, signinResponse] = await Promise.all([
      pybossa.getAccountRegistration(),
      pybossa.getAccountSignin()
    ])
    return {
      form: {
        endpoint: '/account/register',
        method: 'post',
        model: registrationResponse.data.form,
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
      auth: signinResponse.data.auth
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
     * Redirect after sucessful signup.
     * @param {Object} data
     *   The response.
     */
    onSuccess (data) {
      if (data.status === 'sent') {
        swal(
          'Confirm your email',
          'To complete your registration please click the confirmation ' +
          'link in the email that we just sent you',
          'success'
        )
        this.$router.push({ name: 'index' })
      } else {
        this.$router.push({ path: data.next })
      }
    }
  },

  beforeRouteEnter (to, from, next) {
    let data = {}
    Promise.all([
      pybossa.getAccountRegistration(),
      pybossa.getAccountSignin()
    ]).then(([regResponse, signinResponse]) => {
      data = regResponse.data
      data.auth = signinResponse.data.auth
      next(vm => vm.setData(data))
    })
  }
}
</script>
