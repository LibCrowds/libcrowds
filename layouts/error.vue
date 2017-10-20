<template>
  <main id="error-layout">
    <div class="container text-center">
      <icon label="Error" class="mb-2">
        <icon :name="iconName"></icon>
        <icon name="circle-thin" scale="2"></icon>
      </icon>

      <h1 class="title">
        {{ error.statusCode }}
      </h1>
      <h2 class="info">
        {{ message }}
      </h2>
      <b-btn
        variant="dark"
        size="lg"
        :to="{
          name: 'index'
        }">
        Home
      </b-btn>
    </div>
  </main>
</template>

<script>
import 'vue-awesome/icons/circle-thin'
import 'vue-awesome/icons/lock'
import 'vue-awesome/icons/exclamation'
import statuses from 'statuses'

export default {
  props: {
    error: {
      type: Object
    }
  },

  computed: {
    iconName () {
      if (this.error.statusCode === 403 || this.error.statusCode === 401) {
        return 'lock'
      }
      return 'exclamation'
    },
    message () {
      if (!this.error.message) {
        return statuses[this.error.statusCode]
      }
      return this.error.message
    }
  }
}
</script>

<style lang="scss" scoped>
#error-layout {
  height: 100vh;
  display: flex;

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .bounce-enter-active {
    animation: bounce-in .8s;
  }
  .bounce-leave-active {
    animation: bounce-out .5s;
  }
  @keyframes bounce-in {
    0% { transform: scale(0) }
    50% { transform: scale(1.5) }
    100% { transform: scale(1) }
  }
  @keyframes bounce-out {
    0% { transform: scale(1) }
    50% { transform: scale(1.5) }
    100% { transform: scale(0) }
  }
}
</style>
