<template>
  <card-form
    header="Security Settings"
    submit-text="Reset Password"
    :form="form">
  </card-form>
</template>

<script>
import CardForm from '@/components/forms/CardForm'
import pybossa from '@/api/pybossa'

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
    pybossa.getUpdateProfile(to.params.username).then(r => {
      next(vm => vm.setData(r.data))
    })
  },

  beforeRouteUpdate (to, from, next) {
    this.form.model = {}
    pybossa.getUpdateProfile(to.params.username).then(r => {
      this.setData(r.data)
      next()
    })
  }
}
</script>
