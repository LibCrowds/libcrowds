<template>
  <card-base
    :title="title"
    help="Choose the common task presenter options for the microsite">

    <pybossa-form
      no-border
      v-if="!refreshing"
      submit-text="Update"
      :form="form"
      @success="onSuccess">
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

  mixins: [ fetchCollectionByName, notifications ],

  data () {
    return {
      title: 'Task Presenter',
      extraFields: [],
      refreshing: false
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
    }
  },

  methods: {
    /**
     * Handle form submission success.
     */
    onSuccess () {
      this.notifySuccess({ message: 'Task presenter updated' })
    }
  }
}
</script>
