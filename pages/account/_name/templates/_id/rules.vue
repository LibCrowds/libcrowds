<template>
  <card-base :title="title" :description="description">
    <p slot="guidance">
      The form below can be used to configure the analysis process that runs
      when each task is completed. The output of this analysis process is used
      to update the final result for the task.
    </p>
    <hr>

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
      <div slot="bottom" class="d-flex form-group mt-1">
        <no-ssr>
          <toggle-button
            :value="form.model.trim_punctuation"
            :sync="true"
            :labels="true"
            @change="updateModelBoolean('trim_punctuation', $event)">
          </toggle-button>
        </no-ssr>
        <label class="ml-1">
          Trim punctuation from the begining and end of transcribed text
        </label>
      </div>

      <div
        v-if="presenter == 'iiif-annotation'"
        slot="bottom"
        class="d-flex form-group mt-1">
        <no-ssr>
          <toggle-button
            :value="form.model.concatenate"
            :sync="true"
            :labels="true"
            @change="updateModelBoolean('concatenate', $event)">
          </toggle-button>
        </no-ssr>
        <label class="ml-1">
          Concatenate all fields into a single annotation
        </label>
      </div>

      <div
        v-if="presenter == 'iiif-annotation'"
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
        v-if="presenter == 'iiif-annotation' && form.model.date_format"
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
        v-if="presenter == 'iiif-annotation' && form.model.date_format"
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
        v-if="presenter == 'iiif-annotation'"
        slot="bottom"
        class="d-flex form-group mt-1">
        <no-ssr>
          <toggle-button
            :value="form.model.target_from_select_parent"
            :sync="true"
            :labels="true"
            @change="updateModelBoolean('target_from_select_parent', $event)">
          </toggle-button>
        </no-ssr>
        <label class="ml-1">
          Set annotation target from parent selection task
        </label>
      </div>

    </pybossa-form>
  </card-base>
</template>

<script>
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'templates-dashboard',

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
        presenter: data.presenter,
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

  methods: {
    /**
     * Update the current template on form submission success.
     * @param {Object} data
     *   The data returned from the form.
     */
    onFormSuccess (data) {
      this.$store.dispatch('UPDATE_CURRENT_TEMPLATE', data.template)
      this.$store.dispatch('UPDATE_N_PENDING_TEMPLATES', this.$axios)
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
