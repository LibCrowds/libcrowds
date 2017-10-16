<template>
  <div id="reset-password">
    <div class="container my-5">
      <div class="col-lg-8 mx-auto">
        <card-form
          header="Reset Password"
          submitText="Reset"
          :form="form"
          :next="next">
        </card-form>
      </div>
    </div>
  </div>
</template>

<script>
import localConfig from '@/local.config'
import CardForm from '@/components/forms/CardForm'
import pybossa from '@/api/pybossa'

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
    CardForm
  }
}
</script>
