<template>
  <b-modal :id="name" title="Sign in" style="display: block;" @ok="submit">

    <div v-if="formLoading">
      <loading></loading>
    </div>

    <div class="p-2" v-else>

      <p class="lead text-center">
        Enter your {{ config.brand }} account details
      </p>

      <b-form-fieldset
        v-for="f in fields"
        :key="f.name"
        :feedback="getFeedback(f.name)"
        :state="getState(f.name)">
        <b-form-input
          required
          :type="f.type"
          :placeholder="f.placeholder"
          :state="getState(f.name)"
          v-model="form[f.name]"
          v-on:keyup.enter="submit">
        </b-form-input>
      </b-form-fieldset>

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
      fields: [
        { name: 'email', type: 'email', placeholder: 'Email address' },
        { name: 'password', type: 'password', placeholder: 'Password' }
      ],
      auth: {},
      form: {}
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
    }
  },

  methods: {
    loadForm () {
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
        if (r.data.status !== 'success') {
          e.cancel()
        }
        this.auth = r.data.auth
        this.form = r.data.form
      })
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

  created () {
    this.loadForm()
  }
}
</script>

<style lang="scss">
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
