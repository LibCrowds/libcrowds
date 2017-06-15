<template>
  <crowd-container>

    <h1>Sign in</h1>
    <p class="lead">Using your {{ config.brand }} account details</p>

    <form v-on:submit.prevent>
      <div class="d-flex flex-row">
        <b-form-fieldset
        :feedback="getFeedback('email')"
        :state="getState('email')">
          <b-form-input
            required
            type="email"
            placeholder="Email address"
            :state="getState('email')"
            v-model="form.email"
            v-on:keyup.enter="submit">
          </b-form-input>
        </b-form-fieldset>
        <b-form-fieldset
        :feedback="getFeedback('password')"
        :state="getState('password')">
          <b-form-input
            required
            type="password"
            placeholder="Password"
            :state="getState('password')"
            v-model="form.password"
            v-on:keyup.enter="submit">
          </b-form-input>
        </b-form-fieldset>
      </div>
      <b-button
        variant="success"
        v-on:click="submit">
        Sign in
      </b-button>
    </form>

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

  </crowd-container>
</template>

<script>
import config from '@/config'
import CrowdContainer from '@/components/layouts/CrowdContainer'
import pybossaApi from '@/api/pybossa'
import router from '@/router'
import 'vue-awesome/icons/twitter'
import 'vue-awesome/icons/google-plus'
import 'vue-awesome/icons/facebook'

export default {
  data: function () {
    return {
      config: config,
      form: {
        csrf: null,
        email: null,
        errors: {},
        password: null
      },
      auth: {}
    }
  },

  components: {
    CrowdContainer
  },

  methods: {
    fetchData () {
      pybossaApi.get('/account/signin').then(r => {
        this.handleResponse(r)
      })
    },
    submit () {
      if (document.querySelector('form').checkValidity()) {
        pybossaApi.post('/account/signin', this.form, {
          headers: {
            'X-CSRFToken': this.form.csrf
          }
        }).then(r => {
          this.handleResponse(r)
        })
      }
    },
    redirect (endpoint) {
      const url = `${config.pybossaHost}/${endpoint}`
      window.location.replace(url)
    },
    handleResponse (r) {
      if ('next' in r.data) {
        router.push({ path: r.data.next })
      }
      this.form = r.data.form
      this.auth = r.data.auth
    },
    getFeedback (field) {
      const fb = this.form.errors[field]
      if (!fb) {
        return
      }
      return fb.join()
    },
    getState (field) {
      return field in this.form.errors ? 'danger' : null
    }
  },

  mounted () {
    this.fetchData()
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
