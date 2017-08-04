<template>
  <pybossa-modal-form
    :modalId="modalId"
    :schema="schema"
    :endpoint="endpoint"
    :lead="lead"
    @response="setAuth">

    <div v-if="auth.facebook || auth.twitter || auth.google">
      <p class="lead text-center">
        or sign in with
      </p>
      <div class="row-btn-social">

        <div v-if="auth.facebook">
          <b-button
            class="mx-1"
            variant="facebook"
            @click="redirect('facebook')">
            <icon name="facebook"></icon>
            <span class="ml-1 hidden-md-down">Facebook</span>
          </b-button>
        </div>

        <div v-if="auth.google">
          <b-button
            class="mx-1"
            variant="googleplus"
            @click="redirect('google')">
            <icon name="google-plus"></icon>
            <span class="ml-1 hidden-md-down">Google Plus</span>
          </b-button>
        </div>

        <div v-if="auth.twitter">
          <b-button
            class="mx-1"
            variant="twitter"
            @click="redirect('twitter')">
            <icon name="twitter"></icon>
            <span class="ml-1 hidden-md-down">Twitter</span>
          </b-button>
        </div>

      </div>
    </div>

  </pybossa-modal-form>
</template>

<script>
import 'vue-awesome/icons/twitter'
import 'vue-awesome/icons/google-plus'
import 'vue-awesome/icons/facebook'
import config from '@/config'

export default {
  data: function () {
    return {
      modalId: 'signin-modal',
      endpoint: '/account/signin',
      lead: `Enter your ${config.brand} account details`,
      schema: {
        fields: [{
          model: 'email',
          label: 'Email',
          type: 'input',
          inputType: 'email',
          placeholder: 'Email address',
          required: true
        }, {
          model: 'password',
          label: 'Password',
          type: 'input',
          inputType: 'password',
          placeholder: 'Password',
          required: true
        }]
      },
      auth: {}
    }
  },

  methods: {
    setAuth (r) {
      if ('auth' in r.data) {
        this.auth = r.data.auth
      }
    },
    redirect (endpoint) {
      const next = window.location.href
      window.location = `${config.pybossaHost}/${endpoint}?next=${next}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/main';

.row-btn-social {
  display: flex;
  flex-direction: row;
  justify-content: center;

  @include media-breakpoint-up(md) {
    justify-content: space-around;
  }

  .btn {
    @include hover-focus;
    border-radius: 0;
    color: $white;
    height: 100%;
    display: flex;

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
  }

  /* Fix inconsistend heights */
  svg {
    display: flex;
    height: 1.2rem;
  }
}
</style>
