<template>
  <b-modal :id="name" title="Sign in" style="display: block;">
    <div class="p-2 text-center">

      <p class="lead">Enter your {{ config.brand }} account details</p>

      <pybossa-form
        endpoint="/account/signin"
        :fields="fields"
        @response="onFormResponse">
      </pybossa-form>

      <div v-if="auth.facebook || auth.twitter || auth.google">
        <p class="lead my-2">or sign in with</p>
        <div class="row-btn-social">

          <div v-if="auth.facebook">
            <b-button
              class="mx-1"
              variant="facebook"
              v-on:click="redirect('facebook')">
              <icon name="facebook"></icon>
              <span class="ml-1 hidden-md-down">Facebook</span>
            </b-button>
          </div>

          <div v-if="auth.google">
            <b-button
              class="mx-1"
              variant="googleplus"
              v-on:click="redirect('google')">
              <icon name="google-plus"></icon>
              <span class="ml-1 hidden-md-down">Google Plus</span>
            </b-button>
          </div>

          <div v-if="auth.twitter">
            <b-button
              class="mx-1"
              variant="twitter"
              v-on:click="redirect('twitter')">
              <icon name="twitter"></icon>
              <span class="ml-1 hidden-md-down">Twitter</span>
            </b-button>
          </div>

        </div>
      </div>

    </div>
  </b-modal>
</template>

<script>
import 'vue-awesome/icons/twitter'
import 'vue-awesome/icons/google-plus'
import 'vue-awesome/icons/facebook'
import config from '@/config'
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
    PybossaForm
  },

  props: {
    name: {
      type: String,
      required: true
    }
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
@import 'src/assets/style/_vars';
@import 'src/assets/style/partials/_modals';
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
