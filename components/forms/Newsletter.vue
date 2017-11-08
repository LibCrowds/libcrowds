<template>
  <b-input-group id="newsletter-form" size="sm">
    <b-form-input type="email"></b-form-input>
    <b-input-group-button>
      <b-btn :variant="btnVariant" @click="submit">Subscribe</b-btn>
    </b-input-group-button>
  </b-input-group>
</template>

<script>
import axios from 'axios'
import localConfig from '@/local.config'
import 'vue-awesome/icons/circle-o-notch'

export default {
  props: {
    btnVariant: {
      type: String,
      default: 'success'
    }
  },

  methods: {
    submit () {
      const url = localConfig.mailchimp
      const parts = url.split('?')
      const endpoint = parts[0].replace('/post', '/post-json')
      const query = parts[1].replace('&amp;', '&')
      const params = {
        'c': '?'
      }
      query.split('&').forEach(part => {
        var item = part.split('=')
        params[item[0]] = decodeURIComponent(item[1])
      })

      axios({
        baseURL: localConfig.pybossa.host,
        url: endpoint,
        method: 'POST,
        data: {},
        headers: {
          'X-CSRFToken': this.model.csrf
        },
        withCredentials: true
      })

      this.$axios.$post(endpoint, params).then(data => {
        console.log(data)
      }).catch(err => {
        this.$nuxt.error(err)
      })
    }
  }
}
</script>
