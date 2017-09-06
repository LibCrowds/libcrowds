<template>
  <card-form
    :header="'Security Settings'"
    :submitText="'Reset Password'"
    :form="form">
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
              model: 'current_password',
              label: 'Current Password',
              type: 'input',
              inputType: 'password'
            },
            {
              model: 'new_password',
              label: 'New Password',
              type: 'input',
              inputType: 'password'
            },
            {
              model: 'confirm',
              label: 'Confirm New Password',
              type: 'input',
              inputType: 'password'
            }
          ]
        }
      }
    }
  },

  metaInfo () {
    return {
      title: `${this.currentUser.fullname}: Security Settings`
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

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      this.form.model = data.password_form
      this.form.model.btn = 'Password'
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
