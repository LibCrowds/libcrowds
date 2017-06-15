<template>
  <default-layout>

    <h1>Sign in</h1>
    <p class="lead">Using your {{ config.brand }} account details</p>

    <pybossa-form
      endpoint="/account/signin"
      :fields="fields"
      @response="onFormResponse">
    </pybossa-form>

    <div v-if="auth.facebook || auth.twitter || auth.google">
      <p class="lead my-2">or use</p>
      <div class="d-flex flex-row">

        <div v-if="auth.facebook">
          <b-button
            variant="facebook"
            class="h-100 d-flex"
            v-on:click="redirect('facebook')">
            <icon name="facebook"></icon>
          </b-button>
        </div>

        <div v-if="auth.google">
          <b-button
            variant="google"
            class="h-100 d-flex"
            v-on:click="redirect('google')">
            <icon name="google-plus"></icon>
          </b-button>
        </div>

        <div v-if="auth.twitter">
          <b-button
            variant="twitter"
            class="h-100 d-flex"
            v-on:click="redirect('twitter')">
            <icon name="twitter"></icon>
          </b-button>
        </div>

      </div>
    </div>

  </default-layout>
</template>

<script>
import 'vue-awesome/icons/twitter'
import 'vue-awesome/icons/google-plus'
import 'vue-awesome/icons/facebook'
import config from '@/config'
import DefaultLayout from '@/components/layouts/Default'
import PybossaForm from '@/components/PybossaForm'

export default {
  data: function () {
    return {
      config: config,
      fields: [
        { name: 'email', type: 'email', placeholder: 'Email address' },
        { name: 'password', type: 'password', placeholder: 'Password' }
      ],
      auth: {}
    }
  },

  components: {
    DefaultLayout,
    PybossaForm
  },

  methods: {
    redirect (endpoint) {
      const url = `${config.pybossaHost}/${endpoint}`
      window.location.replace(url)
    },
    onFormResponse (r) {
      this.auth = r.data.auth
    }
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

.btn-google {
  @include button-variant($white, $google, $google);
}
.btn-twitter {
  @include button-variant($white, $twitter, $twitter);
}
.btn-facebook {
  @include button-variant($white, $facebook, $facebook);
}

.fa-icon {
  width: 3rem;
}
</style>
