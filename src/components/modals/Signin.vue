<template>
  <b-modal
    :id="name"
    title="Sign in"
    @ok="submit"
    @shown="load">

    <div v-if="formLoading">
      <loading></loading>
    </div>

    <div class="p-2" v-else>

      <b-alert 
        show
        :variant="status === 'error' ? 'danger' : status"
        v-for="f in flashMsg">
        {{ f }}
      </b-alert>

      <p class="lead text-center">
        Enter your {{ config.brand }} account details
      </p>
      
      <vue-form-generator 
        :schema="schema"
        :model="form">
      </vue-form-generator>

      <div v-if="auth.facebook || auth.twitter || auth.google">
        <p class="lead my-2 text-center">
          or sign in with
        </p>
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
import isEmpty from 'lodash/isEmpty'
import config from '@/config'
import pybossaApi from '@/api/pybossa'
import Loading from '@/components/Loading'

export default {
  data: function () {
    return {
      config: config,
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
      auth: {},
      form: {},
      status: null,
      flash: ''
    }
  },

  props: {
    name: {
      type: String,
      required: true
    }
  },

  components: {
    Loading
  },

  computed: {
    formLoading () {
      return isEmpty(this.form)
    },
    flashMsg: function () {
      // To handle disappearing and multiple alerts
      return this.flash ? [this.flash] : []
    }
  },

  methods: {
    load () {
      this.status = null
      this.flash = null
      pybossaApi.get('account/signin').then(r => {
        this.auth = r.data.auth
        this.form = r.data.form
      })
    },
    redirect (endpoint) {
      const url = `${config.pybossaHost}/${endpoint}`
      window.location.replace(url)
    },
    submit (e) {
      e.cancel()
      pybossaApi.post('account/signin', this.form, {
        headers: {
          'X-CSRFToken': this.form.csrf
        }
      }).then(r => {
        if (r.data.status === 'success') {
          this.$store.dispatch('UPDATE_CURRENT_USER')
          document.querySelector(`#${this.name}`).classList.remove('show')
          document.querySelector('.modal-backdrop').classList.remove('show')
        } else {
          this.flash = r.data.flash
          this.status = r.data.status
        }
      })
    },
    clear () {
      this.form.errors = {}
      this.flash = ''
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
  }
}
</script>

<style lang="scss">
label {
  display: none !important;
}
</style>

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
