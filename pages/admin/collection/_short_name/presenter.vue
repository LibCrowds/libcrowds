<template>
  <card-base
    :title="title"
    :description="description"
    docs="/collections/presenter/">

    <p slot="guidance">
      Use the form below to apply global setttings for all project pages
      within a collection, such as the text for the share modal.
    </p>
    <hr class="my-1">

    <pybossa-form
      submit-text="Update"
      :form="form"
      @success="onSuccess">
      <div class="form-group" slot="bottom">
        <label class="ml-0">
          Share text
        </label>
        <markdown-editor
          v-model="collection.info.presenter_options.share_text"
          data-size="sm"
          :configs="markdownConfig">
        </markdown-editor>
        <div class="hint">
          The text to be used for the share modal, above the URL field.
        </div>
      </div>
    </pybossa-form>

  </card-base>
</template>

<script>
import pick from 'lodash/pick'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { metaTags } from '@/mixins/metaTags'
import PybossaForm from '@/components/forms/PybossaForm'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, metaTags ],

  data () {
    return {
      title: 'Task Presenter',
      description: 'Set global task presenter options for the collection',
      markdownConfig: {
        spellChecker: false
      }
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
              model: 'info.presenter_options.note_button',
              label: 'Note button',
              type: 'input',
              inputType: 'text',
              hint: 'The text to be used for the notes button.'
            },
            {
              model: 'info.presenter_options.submit_button',
              label: 'Submit button',
              type: 'input',
              inputType: 'text',
              hint: 'The text to be used for the submit button.'
            },
            {
              model: 'info.presenter_options.extra_tag_link',
              label: 'Extra tag link',
              type: 'input',
              inputType: 'text',
              hint: 'Add a secondary link to the task presenter page, using ' +
              ' this text, to encourage voluteers to add tags (leave empty ' +
              'for no additional link).'
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
      this.$notifications.success({ message: 'Task presenter updated' })
    }
  }
}
</script>
