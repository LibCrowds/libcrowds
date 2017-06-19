<template>
  <img 
    v-if="user.info.avatar"
    :src="src" 
    alt="`User avatar for ${user.name}`" 
    class="img-thumbnail rounded-circle">
  <v-gravatar 
    v-else 
    email="user.email_addr" 
    default-img="identicon"
    alt="User avatar for ${user.name}`"
    class="img-thumbnail rounded-circle">
  </v-gravatar>
</template>

<script>
export default {
  computed: {
    src: function () {
      // TODO: Figure out how to determine PyBossa upload folder
    }
  },

  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss">
img {
  width: 200px
}
<style>
