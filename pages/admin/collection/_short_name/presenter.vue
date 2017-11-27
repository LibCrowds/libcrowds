<template>
  <card-base :title="title" :description="description">

    <pybossa-form
      submit-text="Update"
      :form="form"
      @success="onSuccess">
      <div slot="bottom">
        <label class="ml-0">
          Share text
        </label>
        <markdown-editor
          v-model="collection.info.presenter_options.share_text"
          data-size="sm"
          :configs="markdownConfig">
        </markdown-editor>
      </div>
    </pybossa-form>

  </card-base>
</template>

<script>
import pick from 'lodash/pick'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { notifications } from '@/mixins/notifications'
import { metaTags } from '@/mixins/metaTags'
import PybossaForm from '@/components/forms/PybossaForm'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, notifications, metaTags ],

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
              inputType: 'text'
            },
            {
              model: 'info.presenter_options.submit_button',
              label: 'Submit button',
              type: 'input',
              inputType: 'text'
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
