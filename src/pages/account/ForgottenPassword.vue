<template>
  <div id="forgotten-password">
    <basic-layout
      :navbarSticky="true"
      :navbarFixed="null"
      :navbarInvertable="false">
      <div class="container my-3">
        <div class="col-lg-8 offset-lg-2">
          <card-form
            :header="'Forgotten Password'"
            :lead="lead"
            :submitText="'Reset'"
            :endpoint="form.endpoint"
            :schema="form.schema"
            :model="form.model">
          </card-form>
        </div>
      </div>
    </basic-layout>
  </div>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import CardForm from '@/components/forms/CardForm'
import BasicLayout from '@/components/layouts/Basic'

export default {
  data: function () {
    return {
      form: {
        endpoint: '/account/forgot-password',
        model: {},
        schema: {
          fields: [
            {
              model: 'email_addr',
              label: 'Email',
              type: 'input',
              inputType: 'email',
              placeholder: 'you@example.com'
            }
          ]
        }
      }
    }
  },

  components: {
    BasicLayout,
    CardForm
  },

  metaInfo: {
    title: 'Forgotten Password'
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      this.form.model = data.form
    }
  },

  beforeRouteEnter (to, from, next) {
    pybossaApi.get('/account/forgot-password').then(r => {
      next(vm => vm.setData(r.data))
    })
  }
}
</script>
