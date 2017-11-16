<template>
  <card-base
    :title="title"
    help="Choose the common task presenter options for the microsite">

    <pybossa-form
      no-border
      submit-text="Update"
      :form="form"
      @success="onSuccess">

      <!-- Rules input for LibCrowds Viewer -->
      <b-card v-if="presenter === 'libcrowdsviewer'" slot="bottom">
        <label>Select Mode Confirmation Rules</label>
        <b-table
          hover
          striped
          show-empty
          empty-text="No rules have been added"
          class="mb-2"
          :items="selectRulesTableItems"
          :fields="selectRulesTableFields">
          <template slot="action" scope="rule">
            <b-btn
              variant="warning"
              size="sm"
              @click="deleteSelectRule(rule.item.tag)">
              Remove
            </b-btn>
          </template>
        </b-table>
        <b-form>
          <label class="mr-sm-1" for="tag">Tag</label>
          <b-input id="tag" type="text" class="mb-2" placeholder="Enter a tag">
          </b-input>
          <label class="mr-sm-1" for="n-required">Number Required</label>
          <b-input id="n-required" placeholder="1" class="mb-2" type="number">
          </b-input>
          <b-button
            variant="success"
            class="form-group mb-0 float-right"
            @click="addSelectRule">
            Add Rule
          </b-button>
        </b-form>
      </b-card>

    </pybossa-form>

  </card-base>
</template>

<script>
import pick from 'lodash/pick'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { notifications } from '@/mixins/notifications'
import PybossaForm from '@/components/forms/PybossaForm'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [fetchCollectionByName, notifications],

  data () {
    return {
      title: 'Task Presenter',
      selectRulesTableFields: {
        tag: {
          label: 'Tag'
        },
        nRequired: {
          label: 'Number Required',
          class: 'text-center'
        },
        action: {
          label: 'Action',
          class: 'text-center'
        }
      }
    }
  },

  head () {
    return {
      title: this.title
    }
  },

  components: {
    PybossaForm,
    CardBase
  },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    },

    form () {
      return {
        endpoint: `/api/category/${this.collection.id}`,
        method: 'put',
        model: pick(
          this.collection,
          'info'
        ),
        schema: {
          fields: [
            {
              model: 'info.presenter',
              label: 'Task Presenter',
              type: 'select',
              values: [
                {
                  id: 'libcrowdsviewer',
                  name: 'LibCrowds Viewer'
                },
                {
                  id: 'z3950',
                  name: 'Z39.50'
                }
              ]
            },

            // LibCrowds Viewer options
            {
              model: 'info.presenter_options.libcrowdsviewer.shareText',
              label: 'Share Modal Text',
              type: 'textArea',
              rows: 3,
              placeholder: 'Text to add to the the share modal (use markdown)',
              visible: (model) => {
                return model && model.info.presenter === 'libcrowdsviewer'
              }
            },
            {
              model: 'info.presenter_options.libcrowdsviewer.noteText',
              label: 'Note Button Text',
              type: 'textArea',
              rows: 3,
              placeholder: 'Text for the note button (use markdown)',
              visible: (model) => {
                return model && model.info.presenter === 'libcrowdsviewer'
              }
            },
            {
              model: 'info.presenter_options.libcrowdsviewer.submitText',
              label: 'Submit Button Text',
              type: 'textArea',
              rows: 3,
              placeholder: 'Text for the submit button (use markdown)',
              visible: (model) => {
                return model && model.info.presenter === 'libcrowdsviewer'
              }
            }
          ]
        }
      }
    },

    presenter () {
      return this.collection.info && this.collection.info.presenter
        ? this.collection.info.presenter
        : null
    },

    selectRulesTableItems () {
      const opts = this.collection.info.presenter_opts
      const rules = opts.libcrowdsviewer.selectRules
      const items = []
      for (let key of Object.keys(rules)) {
        items.push({
          tag: key,
          nRequired: rules[key]
        })
      }
      return items
    }
  },

  methods: {
    /**
     * Handle form submission success.
     */
    onSuccess () {
      this.notifySuccess({ message: 'Task presenter updated' })
    },

    /**
     * Save a LibCrowds Viewer select rule.
     */
    addSelectRule (evt) {
      const form = evt.target.parentElement
      const tag = form.querySelector('#tag').value
      const nRequired = form.querySelector('#n-required').value
      const opts = this.collection.info.presenter_opts
      opts.libcrowdsviewer.selectRules[tag] = nRequired
      this.collection.info.presenter_opts = Object.assign({}, opts)
    },

    /**
     * Delete a LibCrowds Viewer select rule.
     */
    deleteSelectRule (tag) {
      const opts = this.collection.info.presenter_opts
      delete opts.libcrowdsviewer.selectRules[tag]
      this.collection.info.presenter_opts = Object.assign({}, opts)
    }
  }
}
</script>
