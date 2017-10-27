<template>
  <div id="error-layout">

    <app-navbar :current-user="currentUser"></app-navbar>

    <main>
      <div class="container text-center">

        <div id="error-code" class="inset-text">
          {{ error.statusCode }}
        </div>

        <div class="lead mt-1 mb-2">
          {{ error.message }}
        </div>

        <b-btn
          variant="success"
          size="lg"
          class="mt-1"
          :to="{
            name: 'index'
          }">
          Home page
        </b-btn>

      </div>
    </main>

    <app-footer :collections="publishedCollections"></app-footer>

  </div>
</template>

<script>
import AppFooter from '@/components/footers/App'
import AppNavbar from '@/components/navbars/App'

export default {
  props: ['error'],

  components: {
    AppNavbar,
    AppFooter
  },

  computed: {
    publishedCollections () {
      return this.$store.state.publishedCollections
    },

    currentUser () {
      return this.$store.state.currentUser
    }
  }
}
</script>

<style lang="scss">
@import '~assets/style/settings';

#error-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;

  main {
    margin-top: $app-navbar-height;
    margin-bottom: $app-navbar-height;
    min-height: 500px;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .lead {
    color: $gray-900;
    font-weight: 400;
  }

  .inset-text {
    background-color: $gray-600;
    color: transparent;
    text-shadow: 2px 2px 3px rgba($gray-300, 0.5);
    -webkit-background-clip: text;
    -moz-background-clip: text;
    background-clip: text;
  }

  #error-code {
    position: relative;
    line-height: 1;
    font-size: 10rem;
    font-weight: 700;
  }

  .btn {
    box-shadow: none;
  }
}
</style>
