<template>
  <card-base :title="title" :description="description">

    <b-card-body v-if="!currentTemplate.task">
      <b-alert show variant="warning" class="mb-0">
        You must configure the task before setting the analysis rules.
      </b-alert>
    </b-card-body>

    <pybossa-form
      v-else
      submit-text="Update"
      :form="form">

      <div slot="bottom" class="d-flex form-group mt-1">
        <toggle-button
          :value="form.model.trim_punctuation"
          :sync="true"
          :labels="true"
          @change="updateModelBoolean('trim_punctuation', $event)">
        </toggle-button>
        <label class="ml-1">
          Trim punctuation from the begining and end of transcribed text
        </label>
      </div>

      <div
        v-if="presenter == 'iiif-annotation'"
        slot="bottom"
        class="d-flex form-group mt-1">
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

      <div
        v-if="presenter == 'iiif-annotation'"
        slot="bottom"
        class="d-flex form-group mt-1">
        <toggle-button
          :value="form.model.target_from_select_parent"
          :sync="true"
          :labels="true"
          @change="updateModelBoolean('target_from_select_parent', $event)">
        </toggle-button>
        <label class="ml-1">
          Set annotation target from parent selection task
        </label>
      </div>

    </pybossa-form>
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
            fields: [
              {
                model: 'case',
                label: 'Convert Case',
                type: 'select',
                values: [
                  {
                    id: '',
                    name: 'Do not convert'
                  },
                  {
                    id: 'title',
                    name: 'Titlecase'
                  },
                  {
                    id: 'lower',
                    name: 'Lowercase'
                  },
                  {
                    id: 'upper',
                    name: 'Uppercase'
                  }
                ],
                selectOptions: {
                  hideNoneSelectedText: true
                }
              },
              {
                model: 'whitespace',
                label: 'Whitespace handling',
                type: 'select',
                values: [
                  {
                    id: '',
                    name: 'Do not modify'
                  },
                  {
                    id: 'normalise',
                    name: 'Normalise'
                  },
                  {
                    id: 'underscore',
                    name: 'Replace with underscores'
                  },
                  {
                    id: 'full_stop',
                    name: 'Replace with full stops'
                  }
                ],
                selectOptions: {
                  hideNoneSelectedText: true
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

  computed: {
    currentTemplate () {
      return this.$store.state.currentTemplate
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
