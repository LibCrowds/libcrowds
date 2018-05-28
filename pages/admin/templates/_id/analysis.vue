<template>
  <card-base
    :title="title"
    :description="description"
    docs="/templates/analysis/">
    <p slot="guidance">
      The form below can be used to configure the analysis process that runs
      when each task is completed. The output of this analysis process is used
      to generate the final result for each task.
    </p>
    <hr class="my-1">

    <b-card-body v-if="!currentTemplate.task">
      <b-alert show variant="warning" class="mb-0">
        You must configure the task before setting the analysis rules.
      </b-alert>
    </b-card-body>

    <pybossa-form
      v-else
      submit-text="Update"
      :form="form"
      @success="onFormSuccess">
      <div slot="bottom" class="form-group mt-1">
        <div class="d-flex">
          <no-ssr>
            <toggle-button
              :value="form.model.trim_punctuation"
              :sync="true"
              :labels="true"
              @change="updateModelBoolean('trim_punctuation', $event)">
            </toggle-button>
          </no-ssr>
          <label class="ml-1">
            Trim punctuation
          </label>
        </div>
        <div class="hint">
          Removes any punctuation from the beginning and end of any
          transcriped text.
        </div>
      </div>

      <div
        slot="bottom"
        class="form-group mt-1">
        <div class="d-flex">
          <no-ssr>
            <toggle-button
              :value="form.model.date_format"
              :sync="true"
              :labels="true"
              @change="updateModelBoolean('date_format', $event)">
            </toggle-button>
          </no-ssr>
          <label class="ml-1">
            Format transcriptions as dates
          </label>
        </div>
        <div class="hint">
          Parses most known date formats to improve comparision between
          inconsistent transcriptions and output the final results according
          to the ISO 8601 standard (YYYY-MM-DD).
        </div>
      </div>

      <div
        v-if="form.model.date_format"
        slot="bottom"
        class="form-group mt-1">
        <div class="d-flex">
          <no-ssr>
            <toggle-button
              :value="form.model.yearfirst"
              :sync="true"
              :labels="true"
              @change="updateModelBoolean('yearfirst', $event)">
            </toggle-button>
          </no-ssr>
          <label class="ml-1">
            Interpret the first value in an ambiguous 3-integer date
            (e.g. 01/05/09) as the year.
          </label>
        </div>
        <div class="hint">
           If set to True, the first number is taken to be the year, otherwise
           the last number is taken to be the year.
        </div>
      </div>

      <div
        v-if="form.model.date_format"
        slot="bottom"
        class="form-group mt-1">
        <div class="d-flex">
          <no-ssr>
            <toggle-button
              :value="form.model.dayfirst"
              :sync="true"
              :labels="true"
              @change="updateModelBoolean('dayfirst', $event)">
            </toggle-button>
          </no-ssr>
          <label class="ml-1">
            Whether to interpret the first value in an ambiguous 3-integer
            date (e.g. 01/05/09) as the day.
          </label>
        </div>
        <div class="hint">
           If set to True, the first number is taken to be the day, otherwise
           the first number is taken to be the month. If yearfirst is set to
           True, this distinguishes between YDM and YMD.
        </div>
      </div>

      <div
        slot="bottom"
        class="form-group mt-1">
        <div class="d-flex">
          <no-ssr>
            <toggle-button
              :value="form.model.remove_fragment_selector"
              :sync="true"
              :labels="true"
              @change="updateModelBoolean('remove_fragment_selector', $event)">
            </toggle-button>
          </no-ssr>
          <label class="ml-1">
            Remove fragment selector from annotation target
          </label>
        </div>
        <div class="hint">
           If set to True, any of selected fragments will be removed from the
           final annotations, leaving just the main source. This is useful for
           child projects where fragments that were highlighted for the task
           are not directly related to the result produced from that task.
           For example, if a parent task was to select all titles
           and a child task was to transcribe a genre associated with each
           title, then the final result should contain just the transcription
           and not the highlighted title text.
        </div>
      </div>

    </pybossa-form>
  </card-base>
</template>

<script>
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'admin-templates-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'Update Template Analysis',
      description: `Edit the project template's analysis rules.`
    }
  },

  asyncData ({ app, params, error, store }) {
    const endpoint = `/lc/templates/${params.id}/rules`
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
                },
                hint: 'Convert the case of transcriptions'
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
                },
                hint: 'Transform any whitespace within transcriptions'
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

  methods: {
    /**
     * Update the current template on form submission success.
     * @param {Object} data
     *   The data returned from the form.
     */
    onFormSuccess (data) {
      this.$store.dispatch('UPDATE_CURRENT_TEMPLATE', data.template)
    },

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
  },

  components: {
    CardBase,
    PybossaForm
  }
}
</script>
