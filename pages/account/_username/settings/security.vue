<template>
  <pybossa-form
    header="Security Settings"
    submit-text="Reset Password"
    :form="form">
  </pybossa-form>
</template>

<script>
import pybossa from '@/api/pybossa'
import PybossaForm from '@/components/forms/PybossaForm'

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

  head () {
    return {
      title: `${this.currentUser.fullname}: Security Settings`
    }
  },

  components: {
    PybossaForm
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    }
  }
}
</script>
