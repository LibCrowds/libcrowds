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
  layout: 'dashboard',

  async asyncData ({ params }) {
    const res = await pybossa.getUpdateProfile(params.username)
    res.data.form.btn = 'Password'
    return {
      form: {
        endpoint: `account/${params.username}/update`,
        method: 'post',
        model: res.data.password_form,
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

  components: {
    CardForm
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    }
  }
}
</script>
