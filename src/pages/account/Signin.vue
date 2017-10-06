<template>
  <div id="signin">
    <div class="container my-5">
      <div class="col-lg-8 mx-auto">
        <card-form
          header="Signin"
          :lead="lead"
          submit-text="Sign in"
          :form="form"
          @success="onSuccess">

          <div
            slot="bottom"
            v-if="auth.facebook || auth.twitter || auth.google">
            <p class="lead text-center">
              or sign in with
            </p>
            <oauth-buttons
              :facebook="auth.facebook"
              :google="auth.google"
              :twitter="auth.twitter">
            </oauth-buttons>
          </div>

          <div slot="footer-left">
            <router-link
              :to="{
                name: 'forgot-password'
              }">
              Forgot your password?
            </router-link>
          </div>

        </card-form>
      </div>
    </div>
  </div>
</template>

<script>
import 'vue-awesome/icons/twitter'
import 'vue-awesome/icons/google'
import 'vue-awesome/icons/facebook'
import siteConfig from '@/siteConfig'
import pybossa from '@/api/pybossa'
import CardForm from '@/components/forms/CardForm'
import OauthButtons from '@/components/buttons/Oauth'
import pybossa from '@/api/pybossa'

export default {
  data: function () {
    return {
      form: {
        endpoint: '/account/signin',
        method: 'post',
        model: {},
        schema: {
          fields: [
            {
              model: 'email',
              label: 'Email',
              type: 'input',
              inputType: 'email'
            },
            {
              model: 'password',
              label: 'Password',
              type: 'input',
              inputType: 'password'
            }
          ]
        }
      },
      auth: {},
      lead: `Enter your ${siteConfig.brand} account details`
    }
  },

  metaInfo () {
    return {
      title: 'Sign in',
      meta: [
        {
          name: 'description',
          content: `Sign in to ${siteConfig.brand}`
        }
      ]
    }
  },

  components: {
    CardForm,
    OauthButtons
  },

  computed: {
    next: function () {
      return this.$route.query.next || '/'
    }
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
     * Handle signin success.
     * @param {Object} data
     *   The response data
     */
    onSuccess (data) {
      this.$router.push({ path: this.next })
    }
  },

  beforeRouteEnter (to, from, next) {
    pybossa.getAccountSignin().then(r => {
      if (r.data.next === '/') {
        next({ path: to.params.next || r.data.next })
      } else {
        next(vm => vm.setData(r.data))
      }
    })
  }
}
</script>
