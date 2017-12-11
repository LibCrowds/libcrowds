<template>
  <card-base :title="title" :description="description">
    <b-btn
      v-if="!project.published"
      slot="controls"
      variant="success"
      class="float-md-right"
      size="sm"
      @click="publish">
      Publish
    </b-btn>

    <pybossa-form
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
import { notifications } from '@/mixins/notifications'
import PybossaForm from '@/components/forms/PybossaForm'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-project-dashboard',

  mixins: [ fetchProjectByName, metaTags, notifications ],

  data () {
    return {
      title: 'Details',
      description: 'Configure the core details for the project'
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
    },

    /**
     * Publish the project.
     */
    publish () {
      this.$swal({
        title: `Publishing the project`,
        html: `
          Once published, the project will appear publically and volunteers
          will be able to contribute. Projects cannot be unpublished, so you
          should make sure that you're happy with everything before continuing.
          <br><br>
          Are you sure you want to publish this project?`,
        type: 'question',
        showCancelButton: true,
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          const endpoint = `/project/${this.project.short_name}/publish`
          return this.$axios.$get(endpoint).then(data => {
            return this.$axios.$post(endpoint, {
              csrf: data.csrf
            })
          })
        }
      }).then(result => {
        if (result) {
          this.flash(result)
          this.project.published = true
        }
      })
    }
  }
}
</script>
