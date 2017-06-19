<template>
  <pybossa-modal-form
    :modalId="modalId"
    :schema="schema"
    :endpoint="endpoint"
    @success="updateCurrentUser">

    <p class="lead text-center" slot="above">
      Create a {{ config.brand }} account
    </p>

  </pybossa-modal-form>
</template>

<script>
import config from '@/config'

export default {
  data: function () {
    return {
      config: config,
      endpoint: '/account/register/',
      schema: {
        fields: [
        {
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
    modalId: {
      type: String,
      required: true
    }
  },

  methods: {
    updateCurrentUser () {
      this.$store.dispatch('UPDATE_CURRENT_USER')
    }
  }
}
</script>
