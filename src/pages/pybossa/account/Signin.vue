<template>
  <signin-form></signin-form>
</template>

<script>
import SigninForm from '@/components/forms/Signin'
import config from '@/config'

export default {
  data: function () {
    return {
      config: config
    }
  },

  components: {
    SigninForm
  }
}
</script>

<style>
</style>
