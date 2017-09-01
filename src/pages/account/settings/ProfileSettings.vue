<template>
  <card-form
    :header="'Profile Settings'"
    :submitText="'Reset API Key'"
    :form="form"
    @success="updateCurrentUser">
  </card-form>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import CardForm from '@/components/forms/CardForm'

export default {
  data: function () {
    return {
      form: {
        endpoint: `account/${this.currentUser.name}/update`,
        method: 'post',
        model: {},
        schema: {
          fields: [
            {
              model: 'fullname',
              label: 'Full name',
              type: 'input',
              inputType: 'text'
            },
            {
              model: 'name',
              label: 'Username',
              type: 'input',
              inputType: 'text'
            },
            {
              model: 'email_addr',
              label: 'Email',
              type: 'input',
              inputType: 'email'
            }
          ]
        }
      }
    }
  },

  props: {
    currentUser: {
      type: Object,
      required: true
    }
  },

  components: {
    CardForm
  },

  metaInfo: {
    title: 'Account Settings: Profile'
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      this.form.model = data.form
      this.form.model.btn = 'Profile'
    },

    /**
     * Trigger an update of the current user.
     */
    updateCurrentUser () {
      this.$store.dispatch('UPDATE_CURRENT_USER')
    }
  },

  beforeRouteEnter (to, from, next) {
    pybossaApi.get(`account/${to.params.username}/update`).then(r => {
      next(vm => vm.setData(r.data))
    })
  },

  beforeRouteUpdate (to, from, next) {
    this.form.model = {}
    pybossaApi.get(`account/${to.params.username}/update`).then(r => {
      this.setData(r.data)
      next()
    })
  }
}
</script>
