<template>
  <card-base :title="title" :description="description">
    <pybossa-form
      v-if="hasAnalysisRules"
      submit-text="Update"
      :form="form">

      <div slot="bottom" class="d-flex form-group mt-1">
        <toggle-button
          :value="form.model.titlecase"
          :sync="true"
          :labels="true"
          @change="updateModelBoolean('titlecase', $event)">
        </toggle-button>
        <label class="ml-1">
          Convert to titlecase
        </label>
      </div>

      <div slot="bottom" class="d-flex form-group mt-1">
        <toggle-button
          :value="form.model.whitespace"
          :sync="true"
          :labels="true"
          @change="updateModelBoolean('whitespace', $event)">
        </toggle-button>
        <label class="ml-1">
          Normalise whitespace, removing any multiple spaces between words
        </label>
      </div>

      <div slot="bottom" class="d-flex form-group mt-1">
        <toggle-button
          :value="form.model.trimpunctuation"
          :sync="true"
          :labels="true"
          @change="updateModelBoolean('trimpunctuation', $event)">
        </toggle-button>
        <label class="ml-1">
          Trim punctuation from the begining and end of transcribed text
        </label>
      </div>

      <div slot="bottom" class="d-flex form-group mt-1">
        <toggle-button
          :value="form.model.concatenate"
          :sync="true"
          :labels="true"
          @change="updateModelBoolean('concatenate', $event)">
        </toggle-button>
        <label class="ml-1">
          Concatenate all fields into a single annotation
        </label>
      </div>

    </pybossa-form>
    <b-card-body v-else>
      <b-alert show variant="warning" class="mb-0">
        Analysis rules are currently only available for IIIF transcribe
        templates.
      </b-alert>
    </b-card-body>
  </card-base>
</template>

<script>
import { fetchTemplateById } from '@/mixins/fetchTemplateById'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'templates-dashboard',

  mixins: [ metaTags, fetchTemplateById ],

  data () {
    return {
      title: 'Update Analysis Rules',
      description: `Edit the project template's analysis rules.`
    }
  },

  asyncData ({ app, params, error }) {
    const name = params.name
    const endpoint = `/libcrowds/users/${name}/templates/${params.id}/rules`
    return app.$axios.$get(endpoint).then(data => {
      return {
        presenter: data.presenter,
        template: data.template,
        form: {
          endpoint: endpoint,
          method: 'post',
          model: data.form,
          schema: {
            fields: [] // toggles used for all fields instead
          }
        }
      }
    }).catch(err => {
      error(err)
    })
  },

  computed: {
    currentTemplate () {
      return this.$store.state.currentTemplate
    },

    hasAnalysisRules () {
      const task = this.currentTemplate.task
      if (typeof task !== 'object') {
        return false
      }
      return this.presenter === 'iiif-annotation' && task.mode === 'transcribe'
    }
  },

  components: {
    CardBase,
    PybossaForm
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
