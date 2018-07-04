<template>
  <card-base :title="title" :description="description">
    <pybossa-form
      submit-text="Reset"
      :form="form"
      :next="next">
    </pybossa-form>
  </card-base>
</template>

<script>
import { handleHashedFlashes } from '@/mixins/handleHashedFlashes'
import { metaTags } from '@/mixins/metaTags'
import localConfig from '@/local.config'
import PybossaForm from '@/components/forms/PybossaForm'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'container',

  mixins: [ handleHashedFlashes, metaTags ],

  data () {
    return {
      title: 'Forgotten Password',
      description: `Reset your ${localConfig.brand} password.`
    }
  },

  asyncData ({ query, app, error }) {
    const endpoint = '/account/forgot-password'
    return app.$axios.$get(endpoint).then(data => {
      return {
        next: query.next || '/',
        form: {
          endpoint: endpoint,
          method: 'post',
          model: data.form,
          schema: {
            fields: [
              {
                model: 'email_addr',
                label: 'Email',
                type: 'input',
                inputType: 'email',
                autocomplete: 'email',
                placeholder: 'you@example.com',
                hint: 'Please enter your email address'
              }
            ]
          }
        }
      }
    }).catch(err => {
      error(err)
    })
  },

  components: {
    PybossaForm,
    CardBase
  }
}
</script>
