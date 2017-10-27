<template>
  <pybossa-form
    id="account-signin"
    :header="title"
    :lead="lead"
    submit-text="Sign in"
    :form="form"
    :next="next">

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

  </pybossa-form>
</template>

<script>
import localConfig from '@/local.config'
import PybossaForm from '@/components/forms/PybossaForm'
import OauthButtons from '@/components/buttons/Oauth'

export default {
  layout: 'container',

  data () {
    return {
      title: 'Sign in',
      lead: `Enter your ${localConfig.brand} account details`
    }
  },

  async asyncData ({ query, redirect, app, error }) {
    const endpoint = '/account/signin'
    return app.$axios.$get(endpoint).then(data => {
      const next = query.next || '/'

      // Redirect if already signed in
      if (data.next === '/') {
        redirect(next)
      }

      return {
        next: next,
        auth: data.auth,
        form: {
          endpoint: '/account/signin',
          method: 'post',
          model: data.form,
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
    }).catch(err => {
      error({ statusCode: err.statusCode, message: err.message })
    })
  },

  head () {
    return {
      title: this.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Sign in to ${localConfig.brand}`
        }
      ]
    }
  },

  components: {
    PybossaForm,
    OauthButtons
  }
}
</script>
