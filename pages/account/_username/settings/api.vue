<template>
  <pybossa-form
    header="API Settings"
    submit-text="Reset API Key"
    :form="form"
    @success="updateCurrentUser">
  </pybossa-form>
</template>

<script>
import pybossa from '@/api/pybossa'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'dashboards/account',

  async asyncData ({ params }) {
    const res = await pybossa.getResetApiKey(params.username)
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
    PybossaForm
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
      this.$store.dispatch('UPDATE_CURRENT_USER')
    }
  }
}
</script>
