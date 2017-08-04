<template>
  <pybossa-modal-form
    :modalId="modalId"
    :schema="schema"
    :endpoint="endpoint"
    :lead="lead">
  </pybossa-modal-form>
</template>

<script>
import config from '@/config'

export default {
  data: function () {
    return {
      config: config,
      endpoint: '/account/register',
      lead: `Create an account for ${config.brand}`,
      schema: {
        fields: [{
          model: 'name',
          label: 'Username',
          type: 'input',
          inputType: 'text',
          placeholder: 'Username'
        },
        {
          model: 'fullname',
          label: 'Full name',
          type: 'input',
          inputType: 'text',
          placeholder: 'Full name'
        },
        {
          model: 'email_addr',
          label: 'Email',
          type: 'input',
          inputType: 'email',
          placeholder: 'Email address'
        },
        {
          model: 'password',
          label: 'Password',
          type: 'input',
          inputType: 'password',
          placeholder: 'Password'
        },
        {
          model: 'confirm',
          label: 'Password',
          type: 'input',
          inputType: 'password',
          placeholder: 'Confirm password'
        }]
      }
    }
  },

  props: {
    modalId: {
      type: String,
      required: true
    }
  }
}
</script>
