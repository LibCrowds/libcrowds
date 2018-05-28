<template>
  <card-base
    :title="title"
    :description="description"
    docs="/templates/redundancy/">
    <p slot="guidance">
      Use the form below to configure when a task is considered complete and
      a final result created.
    </p>
    <p slot="guidance">
      Result analysis will first be triggered once the minimum number of
      contributions have been made. If the task type determines that a number
      of contributions must match, before a final result is created, then
      contributions will continue to be collected until that minimum number of
      matches is established, or the maximum number of contributions is
      reached.
    </p>
    <hr class="my-1">

    <pybossa-form
      submit-text="Update"
      :form="form"
      @success="onFormSuccess">
    </pybossa-form>

  </card-base>
</template>

<script>
import VueFormGenerator from 'vue-form-generator'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'admin-template-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'Update Template Redundancy',
      description: `Edit the task redundancy settings.`
    }
  },

  asyncData ({ app, params, error, store }) {
    const endpoint = `/lc/templates/${params.id}/update`
    return app.$axios.$get(endpoint).then(data => {
      store.dispatch('UPDATE_CURRENT_TEMPLATE', data.template)
      return {
        form: {
          endpoint: endpoint,
          method: 'post',
          model: data.form,
          schema: {
            fields: [
              {
                model: 'min_answers',
                label: 'Minimum Contributions',
                type: 'input',
                inputType: 'number',
                min: 1,
                max: 10,
                hint: 'The minimum number of contributions accepted before ' +
                  'a final result is created.',
                validator: VueFormGenerator.validators.number
              },
              {
                model: 'max_answers',
                label: 'Maximum Contributions',
                type: 'input',
                inputType: 'number',
                hint: 'The maximum number of contributions accepted before ' +
                'a task is abandoned.',
                validator: (value, field, model) => {
                  if (value < model.min_answers) {
                    return 'Must be greater than the minimum contributions'
                  } else if (value < 1) {
                    return 'The number is too small! Minimum: 1'
                  } else if (value > 30) {
                    return 'The number is too big! Maximum: 30'
                  }
                }
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
    CardBase,
    PybossaForm
  },

  methods: {
    /**
     * Update the current template on form submission success.
     * @param {Object} data
     *   The data returned from the form.
     */
    onFormSuccess (data) {
      this.$store.dispatch('UPDATE_CURRENT_TEMPLATE', data.template)
    }
  }
}
</script>
