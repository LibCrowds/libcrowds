<template>
  <card-form
    :header="'API Settings'"
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
      csrf: null
    }
  },

  metaInfo () {
    return {
      title: `${this.currentUser.fullname}: API Settings`
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

  computed: {
    form: function () {
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
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      this.csrf = data.form.csrf
    },

    /**
     * Trigger an update of the current user.
     */
    updateCurrentUser () {
      this.$store.dispatch('UPDATE_CURRENT_USER')
    }
  },

  beforeRouteEnter (to, from, next) {
    pybossaApi.get(`account/${to.params.username}/resetapikey`).then(r => {
      next(vm => vm.setData(r.data))
    })
  },

  beforeRouteUpdate (to, from, next) {
    this.form.model = {}
    pybossaApi.get(`account/${to.params.username}/resetapikey`).then(r => {
      this.setData(r.data)
      next()
    })
  }
}
</script>
