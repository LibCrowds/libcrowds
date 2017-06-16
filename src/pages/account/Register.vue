<template>

  <default-layout>

    <div class="container text-center">
      <h1>Register</h1>
      <p class="lead">Create a new {{ config.brand }} account</p>

      <pybossa-form
        endpoint="/account/register"
        :fields="fields">
      </pybossa-form>
    </div>

  </default-layout>

</template>

<script>
import config from '@/config'
import DefaultLayout from '@/components/layouts/Default'
import PybossaForm from '@/components/PybossaForm'

export default {
  data: function () {
    return {
      config: config,
      fields: [
        { name: 'name', type: 'text', placeholder: 'Username' },
        { name: 'fullname', type: 'text', placeholder: 'Full name' },
        { name: 'email_addr', type: 'email', placeholder: 'Email address' },
        { name: 'password', type: 'password', placeholder: 'Password' },
        { name: 'confirm', type: 'password', placeholder: 'Confirm password' }
      ]
    }
  },

  metaInfo: {
    title: 'Register'
  }

  components: {
    DefaultLayout,
    PybossaForm
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';
</style>
