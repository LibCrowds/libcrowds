<template>
  <b-tooltip :content="user.name" triggers="hover">
    <img
      v-if="showPlaceholder"
      :src="src"
      :alt="alt"
      class="img-thumbnail rounded-circle"
      onerror="imgError = true">
    <v-gravatar
      v-else
      :email="user.name"
      default-img="identicon"
      :alt="alt"
      class="img-thumbnail rounded-circle">
    </v-gravatar>
  </b-tooltip>
</template>

<script>
export default {
  data () {
    return {
      imgError: false
    }
  },

  computed: {
    showPlaceholder () {
      return this.imgError || !('avatar' in this.user.info)
    },
    src () {
      // TODO: Figure out how to determine PyBossa upload folder
    },
    alt () { return `User avatar for ${this.user.name}` }
  },

  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
img {
  width: 100%;
  height: auto;
}
</style>
