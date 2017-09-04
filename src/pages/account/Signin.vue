<template>
  <div id="signin">
    <div class="container my-5">
      <div class="col-lg-8 offset-lg-2">
        <card-form
          :header="'Signin'"
          :lead="lead"
          :submitText="'Sign in'"
          :form="form"
          @success="onSuccess">

          <div
            slot="bottom"
            v-if="auth.facebook || auth.twitter || auth.google">
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
                  <span class="ml-1 hidden-sm-down">Facebook</span>
                </b-button>
              </div>

              <div v-if="auth.google">
                <b-button
                  class="mx-1"
                  variant="googleplus"
                  @click="redirect('google')">
                  <icon name="google"></icon>
                  <span class="ml-1 hidden-sm-down">Google</span>
                </b-button>
              </div>

              <div v-if="auth.twitter">
                <b-button
                  class="mx-1"
                  variant="twitter"
                  @click="redirect('twitter')">
                  <icon name="twitter"></icon>
                  <span class="ml-1 hidden-sm-down">Twitter</span>
                </b-button>
              </div>

            </div>
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
import pybossaApi from '@/api/pybossa'
import CardForm from '@/components/forms/CardForm'

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

  components: {
    CardForm
  },

  metaInfo: {
    title: 'Sign in'
  },

  methods: {
    /**
     * Redirect to an external endpoint (for OAuth signin).
     * @param {String} endpoint
     *   The endpoint
     */
    redirect (endpoint) {
      const next = this.$route.query.next || window.location.origin
      window.location = `${siteConfig.pybossaHost}/${endpoint}?next=${next}`
    },

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
      this.$router.push({ path: data.next })
    }
  },

  beforeRouteEnter (to, from, next) {
    pybossaApi.get('/account/signin').then(r => {
      if (r.data.next === '/') {
        next({ name: 'landing' })
      } else {
        next(vm => vm.setData(r.data))
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/main';

#signin {
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
}
</style>
