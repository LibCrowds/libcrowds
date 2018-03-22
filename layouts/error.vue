<template>
  <default-base :navbar-brand="localConfig.brand" fixed-top>
    <b-container class="my-4 my-lg-5">
      <b-col xl="8" class="mx-auto">

        <card-base :title="title">
          <b-card-body>
            <p class="lead my-2 text-center">
              {{ normalisedMessage }}
            </p>
          </b-card-body>
          <b-card-footer>
            <b-btn
              variant="success"
              class="float-right"
              :to="{
                name: 'index'
              }">
              Home page
            </b-btn>
          </b-card-footer>
        </card-base>

      </b-col>
    </b-container>
  </default-base>
</template>

<script>
import httpStatus from 'http-status'
import localConfig from '@/local.config'
import DefaultBase from '@/layouts/bases/Default'
import CardBase from '@/components/cards/Base'

export default {
  props: ['error'],

  data () {
    return {
      localConfig: localConfig,
      messages: {
        '404': 'This page could not be found.',
        '405': 'Method not allowed.',
        '500': 'Uh oh, something\'s broken. We will fix it as soon as we can.'
      }
    }
  },

  components: {
    DefaultBase,
    CardBase
  },

  computed: {
    normalisedMessage () {
      const code = this.error.statusCode
      if (this.messages.hasOwnProperty(code)) {
        return this.messages[code]
      }
      return this.error.message
    },

    title () {
      return httpStatus[this.error.statusCode]
    }
  }
}
</script>
