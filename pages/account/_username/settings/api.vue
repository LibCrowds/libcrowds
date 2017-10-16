<template>
  <card-form
    header="API Settings"
    submit-text="Reset API Key"
    :form="form"
    @success="updateCurrentUser">
  </card-form>
</template>

<script>
import CardForm from '@/components/forms/CardForm'

export default {
  layout: 'dashboard',

  async asyncData ({ params, app }) {
    const res = await app.$pybossa.getResetApiKey(params.username)
    return {
      csrf: res.data.form.csrf
    }
  },

  head () {
    return {
      title: `${this.currentUser.fullname}: API Settings`
    }
  },

  components: {
    CardForm
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },
    /**
     * Return the form data.
     */
    form () {
      return {
        endpoint: `account/${this.currentUser.name}/resetapikey`,
        method: 'post',
        model: {
          csrf: this.csrf,
          api_key: this.currentUser.api_key
        },
        schema: {
          fields: [
            {
              model: 'api_key',
              label: 'API Key',
              type: 'input',
              inputType: 'text',
              readonly: true
            }
          ]
        }
      }
    }
  },

  methods: {
    /**
     * Trigger an update of the current user.
     */
    updateCurrentUser () {
      this.$store.dispatch('UPDATE_CURRENT_USER', this.pybossa)
    }
  }
}
</script>
