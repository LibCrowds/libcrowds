<template>
  <div id="account-signin">
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
              :twitter="auth.twitter"
              :next="next">
            </oauth-buttons>
          </div>

          <div slot="footer-left">
            <nuxt-link
              :to="{
                name: 'account-password-forgotten'
              }">
              Forgot your password?
            </nuxt-link>
          </div>

        </card-form>
      </div>
    </div>
  </div>
</template>

<script>
import localConfig from '@/local.config'
import pybossa from '@/api/pybossa'
import CardForm from '@/components/forms/CardForm'
import OauthButtons from '@/components/buttons/Oauth'

export default {
  layout: 'default',

  data () {
    return {
      lead: `Enter your ${localConfig.brand} account details`
    }
  },

  async asyncData ({ query, params }) {
    const res = await pybossa.getAccountSignin()
    const next = query.next || '/'
    return {
      next: next,
      auth: res.data.auth,
      form: {
        endpoint: '/account/signin',
        method: 'post',
        model: res.data.form,
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
      }
    }
  },

  metaInfo () {
    return {
      title: 'Sign in',
      meta: [
        {
          name: 'description',
          content: `Sign in to ${localConfig.brand}`
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
     * Handle success.
     */
    onSuccess () {
      this.$nuxt.$router.push({ path: this.next })
    }
  }
}
</script>
