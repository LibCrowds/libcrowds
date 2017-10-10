<template>
  <div id="register">
    <div class="container my-5">
      <div class="col-lg-8 mx-auto">
        <card-form
          header="Register"
          :submitText="submitText"
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
              :twitter="auth.twitter">
            </oauth-buttons>
            <p class="lead text-center mt-2 mb-1">
              or
            </p>
          </div>
          <div slot="footer-left">
            <p class="mb-0 mr-3">
              <small>
                By signing up you are agreeing to the
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
import swal from 'sweetalert2'
import siteConfig from '@/siteConfig'
import CardForm from '@/components/forms/CardForm'
import OauthButtons from '@/components/buttons/Oauth'
import pybossa from '@/api/pybossa'

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
      auth: {}
    }
  },

  metaInfo () {
    return {
      title: 'Register',
      meta: [
        {
          name: 'description',
          content: `Sign up for a new ${siteConfig.brand} account`
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
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      this.form.model = data.form
      this.auth = data.auth
    },

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
        this.$router.push({ name: 'landing' })
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
