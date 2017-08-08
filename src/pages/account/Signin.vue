<template>
  <div id="signin">
    <basic-layout
      :navbarSticky="'top'"
      :navbarFixed="null"
      :navbarInvertable="false">
      <div class="container my-3">
        <div class="col-lg-8 offset-lg-2">
          <card-form
            :header="'Signin'"
            :lead="lead"
            :submitText="'Sign in'"
            :endpoint="form.endpoint"
            :schema="form.schema"
            :model="form.model">

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
                    <icon name="google-plus"></icon>
                    <span class="ml-1 hidden-sm-down">Google Plus</span>
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
    </basic-layout>
  </div>
</template>

<script>
import 'vue-awesome/icons/twitter'
import 'vue-awesome/icons/google-plus'
import 'vue-awesome/icons/facebook'
import config from '@/config'
import pybossaApi from '@/api/pybossa'
import CardForm from '@/components/forms/CardForm'
import BasicLayout from '@/components/layouts/Basic'

export default {
  data: function () {
    return {
      form: {
        endpoint: '/account/signin',
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
      lead: `Enter your ${config.brand} account details`
    }
  },

  components: {
    BasicLayout,
    CardForm
  },

  metaInfo: {
    title: 'Sign in'
  },

  methods: {
    /**
     * Redirect to an external endpoint (for OAuth signin).
     */
    redirect (endpoint) {
      const next = window.location.href
      window.location = `${config.pybossaHost}/${endpoint}?next=${next}`
    },

    /**
     * Set the data.
     */
    setData (data) {
      this.form.model = data.form
      this.auth = data.auth
    }
  },

  beforeRouteEnter (to, from, next) {
    pybossaApi.get('/account/signin').then(r => {
      next(vm => vm.setData(r.data))
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
