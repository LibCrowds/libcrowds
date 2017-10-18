<template>
  <div id="reset-password">
    <div class="container my-5">
      <div class="col-lg-8 mx-auto">
        <pybossa-form
          header="Reset Password"
          submitText="Reset"
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
    const res = await pybossa.getResetPassword()
    return {
      next: query.next || '/',
      form: {
        endpoint: '/account/reset-password',
        method: 'post',
        model: res.data.form,
        params: query || null,
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

  head () {
    return {
      title: 'Reset Password',
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
