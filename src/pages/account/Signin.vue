<template>

  <default-layout>

    <div class="container text-center">
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

  metaInfo: {
    title: 'Sign in'
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

<style lang="scss" scoped>
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

.btn {
  @include hover-focus;
  border-radius: 0;
  color: $white;

  @include hover-focus {
    color: $white;
  }

  &.btn-twitter {
    background: $twitter;

    @include hover-focus {
      background: darken($twitter, 5%);
    }
  }

  &.btn-facebook {
    background: $facebook;

    @include hover-focus {
      background: darken($facebook, 5%);
    }
  }

  &.btn-googleplus {
    background: $googleplus;

    @include hover-focus {
      background: darken($googleplus, 5%);
    }
  }

  &.btn-linkedin {
    background: $linkedin;

    @include hover-focus {
      background: darken($linkedin, 5%);
    }
  }
}

/* Fix inconsistend heights */
svg {
  display: flex;
  height: 1.2rem;
}
</style>
