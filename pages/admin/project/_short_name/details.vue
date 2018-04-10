<template>
  <card-base :title="title" :description="description">
    <pybossa-form
      submit-text="Update"
      :form="form">
      <div slot="bottom" class="d-flex form-group mt-1">
        <no-ssr>
          <toggle-button
            :value="form.model.protect"
            :sync="true"
            :labels="true"
            @change="updateModelBoolean('protect', $event)">
          </toggle-button>
        </no-ssr>
        <label class="ml-1">
          Require a password
        </label>
      </div>
      <div slot="bottom" class="d-flex form-group mt-1">
        <no-ssr>
          <toggle-button
            :value="form.model.allow_anonymous_contributors"
            :sync="true"
            :labels="true"
            @change="updateModelBoolean('allow_anonymous_contributors', $event)">
          </toggle-button>
        </no-ssr>
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

  middleware: 'is-admin',

  mixins: [ fetchProjectByName, metaTags ],

  data () {
    return {
      title: 'Core Details',
      description: 'Configure the core details for the project'
    }
  },

  asyncData ({ params, app, error }) {
    const endpoint = `/project/${params.short_name}/update`
    return app.$axios.$get(endpoint).then(data => {
      return {
        form: {
          endpoint: endpoint,
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

  computed: {
    project () {
      return this.$store.state.currentProject
    }
  },

  methods: {
    /**
     * Update model boolean.
     * @param {String} key
     *   The model key.
     * @param {Object} evt
     *   The event.
     */
    updateModelBoolean (key, evt) {
      this.form.model[key] = evt.value
    }
  }
}
</script>
