<template>
  <pybossa-modal-form
    :name="name"
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
          placeholder: 'Username',
          required: true
        },
        {
          model: 'email_addr',
          label: 'Email',
          type: 'input',
          inputType: 'email',
          placeholder: 'Email address',
          required: true
        },
        {
          model: 'password',
          label: 'Password',
          type: 'input',
          inputType: 'password',
          placeholder: 'Password',
          required: true
        },
        {
          model: 'confirm',
          label: 'Password',
          type: 'input',
          inputType: 'password',
          placeholder: 'Confirm password',
          required: true
        }]
      }
    }
  },

  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>
