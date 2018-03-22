<template>
  <card-base :title="title">
    <pybossa-form
      id="account-signin"
      :lead="lead"
      submit-text="Sign in"
      :next="next"
      :form="form"
      @success="onSuccess">

      <div
        slot="bottom"
        v-if="auth && auth.facebook || auth.twitter || auth.google">
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
            name: 'account-forgot-password'
          }">
          Forgot your password?
        </nuxt-link>
      </div>

    </pybossa-form>
  </card-base>
</template>

<script>
import localConfig from '@local.config'
import { handleHashedFlashes } from '@/mixins/handleHashedFlashes'
import { metaTags } from '@/mixins/metaTags'
import PybossaForm from '@/components/forms/PybossaForm'
import OauthButtons from '@/components/buttons/Oauth'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'container',

  mixins: [ handleHashedFlashes, metaTags ],

  data () {
    return {
      title: 'Sign in',
      description: `Sign in to ${localConfig.brand}.`,
      lead: `Enter your ${localConfig.brand} account details`
    }
  },

  async asyncData ({ query, redirect, app, error }) {
    const endpoint = '/account/signin'
    return app.$axios.$get(endpoint).then(data => {
      const next = query.next || '/'
      if (data.next === '/') {
        // Redirect if already signed in
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
      error(err)
    })
  },

  components: {
    PybossaForm,
    OauthButtons,
    CardBase
  },

  methods: {
    /**
     * Update the current user and sign in to Flaum, if enabled.
     */
    onSuccess () {
      const action = 'UPDATE_CURRENT_USER'

      this.$store.dispatch(action, this.$axios, this.$ga).then(data => {
        if (localConfig.hasOwnProperty('flarum')) {
          return this.$flarum.signin(data.name, data.email_addr)
        } else {
          this.$router.push({ path: this.next })
        }
      }).then(data => {
        this.$router.push({ path: this.next })
      })
    }
  }
}
</script>
