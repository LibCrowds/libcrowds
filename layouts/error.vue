<template>
  <div id="error-layout">

    <top-navbar></top-navbar>

    <main>
      <div class="container text-center">

        <div id="error-code" class="inset-text">
          {{ error.statusCode }}
        </div>

        <div class="lead mt-1 mb-2">
          {{ normalisedMessage }}
        </div>

        <b-btn
          variant="success"
          size="lg"
          class="mt-0 mt-md-1 mb-2"
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
import TopNavbar from '@/components/navbars/Top'

export default {
  props: ['error'],

  data () {
    return {
      messages: {
        '403': 'Forbidden.',
        '404': 'This page could not be found.',
        '405': 'Method not allowed.',
        '500': 'Uh oh, something\'s broken. We will fix it as soon as we can.'
      }
    }
  },

  components: {
    TopNavbar,
    AppFooter
  },

  computed: {
    publishedCollections () {
      return this.$store.state.publishedCollections
    },

    currentUser () {
      return this.$store.state.currentUser
    },

    normalisedMessage () {
      const code = this.error.statusCode
      if (this.messages.hasOwnProperty(code)) {
        return this.messages[code]
      }
      return this.error.message
    }
  },

  mounted () {
    console.log(this.error)
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
    margin-top: $top-navbar-height;
    min-height: 450px;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .lead {
    color: $gray-1000;
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
    font-weight: 700;
    font-size: 4rem;

    @include media-breakpoint-up(md) {
      font-size: 10rem;
    }
  }

  .btn {
    box-shadow: none;
  }
}
</style>
