<template>
  <div id="forgotten-password">
    <div class="container my-5">
      <div class="col-lg-8 mx-auto">
        <pybossa-form
          header="Forgotten Password"
          submit-text="Reset"
          :form="form"
          :next="next">
        </pybossa-form>
      </div>
    </div>
  </div>
</template>

<script>
import pybossa from '@/api/pybossa'
import localConfig from '@/local.config'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'default',

  async asyncData ({ query }) {
    let res = await pybossa.getRecoverPassword()
    return {
      next: query.next || '/',
      form: {
        endpoint: '/account/forgot-password',
        method: 'post',
        model: res.data.form,
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

  head () {
    return {
      title: 'Forgotten Password',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Reset your ${localConfig.brand} password`
        }
      ]
    }
  },

  components: {
    PybossaForm
  }
}
</script>
