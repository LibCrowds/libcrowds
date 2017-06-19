<template>
  <pybossa-modal-form
    :modalId="modalId"
    :schema="schema"
    :endpoint="endpoint"
    :lead="lead"
    @response="setAuth"
    @success="updateCurrentUser">

    <div v-if="auth.facebook || auth.twitter || auth.google" slot="below">
      <p class="lead my-2 text-center">
        or sign in with
      </p>
      <div class="row-btn-social">

        <div v-if="auth.facebook">
          <b-button
            class="mx-1"
            variant="facebook"
            v-on:click="window.location.replace(
              `${config.pybossaHost}/facebook`
            )">
            <icon name="facebook"></icon>
            <span class="ml-1 hidden-md-down">Facebook</span>
          </b-button>
        </div>

        <div v-if="auth.google">
          <b-button
            class="mx-1"
            variant="googleplus"
            v-on:click="window.location.replace(
              `${config.pybossaHost}/google`
            )">
            <icon name="google-plus"></icon>
            <span class="ml-1 hidden-md-down">Google Plus</span>
          </b-button>
        </div>

        <div v-if="auth.twitter">
          <b-button
            class="mx-1"
            variant="twitter"
            v-on:click="window.location.replace(
              `${config.pybossaHost}/twitter`
            )">
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
  name: 'signin-modal',

  data: function () {
    return {
      config: config,
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

  props: {
    modalId: {
      type: String,
      required: true
    }
  },

  methods: {
    updateCurrentUser () {
      this.$store.dispatch('UPDATE_CURRENT_USER')
    },
    setAuth (r) {
      console.log(r)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/_vars';
@import '~bootstrap/scss/bootstrap';

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
