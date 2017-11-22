<template>
  <card-base :title="title" :description="description">

    <pybossa-form
      no-border
      submit-text="Update"
      :form="form">
      <div slot="bottom" class="d-flex form-group mt-1">
        <toggle-button
          :value="form.model.protect"
          :sync="true"
          :labels="true"
          @change="updateModelBoolean('protect', $event)">
        </toggle-button>
        <label class="ml-1">
          Require a password
        </label>
      </div>
      <div slot="bottom" class="d-flex form-group mt-1">
        <toggle-button
          :value="form.model.allow_anonymous_contributors"
          :sync="true"
          :labels="true"
          @change="updateModelBoolean('allow_anonymous_contributors', $event)">
        </toggle-button>
        <label class="ml-1">
          Allow anonymous contributors
        </label>
      </div>
    </pybossa-form>

  </card-base>
</template>

<script>
import { fetchProjectByName } from '@/mixins/fetchProjectByName'
import { metaTags } from '@/mixins/metaTags'
import PybossaForm from '@/components/forms/PybossaForm'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-project-dashboard',

  mixins: [ fetchProjectByName, metaTags ],

  data () {
    return {
      title: 'Settings',
      description: 'Configure the core settings for the project'
    }
  },

  async asyncData ({ params, app, error }) {
    const endpoint = `/project/${params.short_name}/update`
    return app.$axios.$get(endpoint).then(data => {
      return {
        form: {
          endpoint: `project/${params.short_name}/update`,
          method: 'post',
          model: data.form,
          schema: {
            fields: [
              {
                model: 'name',
                label: 'Name',
                type: 'input',
                inputType: 'text'
              },
              {
                model: 'short_name',
                label: 'Short name',
                type: 'input',
                inputType: 'text'
              },
              {
                model: 'description',
                label: 'Description',
                type: 'textArea',
                rows: 2,
                placeholder: 'Short description shown on the project cards'
              },
              {
                model: 'webhook',
                label: 'Webhook URL',
                type: 'input',
                inputType: 'text'
              },
              {
                model: 'pasword',
                label: 'Password',
                type: 'input',
                inputType: 'text'
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
  },

  methods: {
    /**
     * Redirect the user on form submit success.
     * @param {String} key
     *   The model key.
     * @param {Object} evt
     *   The event.
     */
    updateModelBoolean (key, evt) {
      this.model[key] = evt.value
    }
  }
}
</script>
