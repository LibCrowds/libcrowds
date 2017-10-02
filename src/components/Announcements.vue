<template>
  <b-dropdown
    right
    id="announcements">
    <icon slot="button-content" name="bell"></icon>
    <b-dropdown-item
      v-for="announcement in announcements"
      :key="announcement.id">
      {{ announcement.body }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import 'vue-awesome/icons/bell'

export default {
  props: {
    currentUser: {
      type: Object,
      required: true
    }
  },

  computed: {
    announcements: function () {
      console.log(this.$store.state)
      return this.$store.state.announcements
    }
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/main';

#announcements {
  .dropdown-toggle {
    color: inherit;
    background: transparent;
    border: none;

    &:after {
      display: none;
    }
  }
}
</style>
