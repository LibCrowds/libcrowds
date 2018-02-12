import Vue from 'vue'

Vue.mixin({
  computed: {
    darkMode () {
      return this.$store.state.darkMode
    }
  }
})
