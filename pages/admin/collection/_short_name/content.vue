<template>
  <card-base
    :title="title"
    :description="description"
    docs="/collections/content/">

    <p slot="guidance">
      Content for the About, Take Part and Data pages can be modified using
      the Markdown forms below. Remember to click the
      <strong>Update</strong> button to save the changes.
    </p>
    <hr class="my-1">

    <pybossa-form
      submit-text="Update"
      :form="form"
      @success="onSuccess">
      <div slot="bottom">
        <label class="ml-0">
          About page
        </label>
        <markdown-editor
          v-model="collection.info.content.about"
          :configs="markdownConfig">
        </markdown-editor>
      </div>
      <div slot="bottom" class="mt-1">
        <label class="ml-0">
          Projects page
        </label>
        <markdown-editor
          v-model="collection.info.content.projects"
          :configs="markdownConfig">
        </markdown-editor>
      </div>
      <div slot="bottom" class="mt-1">
        <label class="ml-0">
          Data page
        </label>
        <markdown-editor
          v-model="collection.info.content.data"
          :configs="markdownConfig">
        </markdown-editor>
      </div>
      <div slot="bottom" class="mt-1">
        <label class="ml-0">
          Browse page
        </label>
        <markdown-editor
          v-model="collection.info.content.browse"
          :configs="markdownConfig">
        </markdown-editor>
      </div>
    </pybossa-form>

  </card-base>
</template>

<script>
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { metaTags } from '@/mixins/metaTags'
import pick from 'lodash/pick'
import PybossaForm from '@/components/forms/PybossaForm'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, metaTags ],

  data () {
    return {
      title: 'Page Content',
      description: 'Configure the microsite page content using Markdown.',
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
          fields: [] // Markdown editors used through slots instead
        }
      }
    }
  },

  methods: {
    /**
     * Handle form success.
     */
    onSuccess () {
      this.$notifications.success({ message: 'Content updated' })
    }
  }
}
</script>
