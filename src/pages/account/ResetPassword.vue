<template>
  <div id="reset-password">
    <div class="container my-5">
      <div class="col-lg-8 offset-lg-2">
        <card-form
          header="Reset Password"
          submitText="Reset"
          :form="form"
          @success="onSuccess">
        </card-form>
      </div>
    </div>
  </div>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import siteConfig from '@/siteConfig'
import CardForm from '@/components/forms/CardForm'

export default {
  data: function () {
    return {
      form: {
        endpoint: '/account/reset-password',
        method: 'post',
        model: {},
        params: {
          key: null // The POST endpoint still required key as query param
        },
        schema: {
          fields: [
            {
              model: 'new_password',
              label: 'New Password',
              type: 'input',
              inputType: 'password',
              placeholder: 'Choose a new password'
            },
            {
              model: 'confirm',
              label: 'Confirm Password',
              type: 'input',
              inputType: 'password',
              placeholder: 'Confirm your new password'
            }
          ]
        }
      }
    }
  },

  metaInfo () {
    return {
      title: 'Reset Password',
      meta: [
        {
          name: 'description',
          content: `Reset your ${siteConfig.brand} password`
        }
      ]
    }
  },

  components: {
    CardForm
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      this.form.model = data.form
      this.form.params = data.params
    },

    /**
     * Redirect to home page on success.
     */
    onSuccess () {
      this.$router.push({ name: 'landing' })
    }
  },

  beforeRouteEnter (to, from, next) {
    pybossaApi.get('/account/reset-password', {
      params: to.query
    }).then(r => {
      r.data.params = to.query
      next(vm => vm.setData(r.data))
    }).catch(err => {
      next({ name: String(err.response.status) })
    })
  }
}
</script>
