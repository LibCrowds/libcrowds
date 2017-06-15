<template>
  <crowd-container>

    <h1>Register</h1>
    <p class="lead">Create a new {{ config.brand }} account</p>

    <pybossa-form
      endpoint="/account/register"
      :fields="fields">
    </pybossa-form>

  </crowd-container>
</template>

<script>
import config from '@/config'
import CrowdContainer from '@/components/layouts/CrowdContainer'
import PybossaForm from '@/components/PybossaForm'

export default {
  data: function () {
    return {
      config: config,
      fields: [
        { name: 'name', type: 'text' },
        { name: 'fullname', type: 'text' },
        { name: 'email_addr', type: 'email' },
        { name: 'password', type: 'password' },
        { name: 'confirm', type: 'password' }
      ]
    }
  },

  components: {
    CrowdContainer,
    PybossaForm
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';
</style>
