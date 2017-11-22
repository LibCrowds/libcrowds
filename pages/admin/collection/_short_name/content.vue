<template>
  <card-base
    id="admin-collection-content"
    :title="title"
    :description="description">

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
    </pybossa-form>

  </card-base>
</template>

<script>
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { notifications } from '@/mixins/notifications'
import { metaTags } from '@/mixins/metaTags'
import pick from 'lodash/pick'
import PybossaForm from '@/components/forms/PybossaForm'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, notifications, metaTags ],

  data () {
    return {
      title: 'Content',
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
      this.notifySuccess({ message: 'Content updated' })
    }
  }
}
</script>

<style lang="scss">
#admin-collection-content {
  .CodeMirror {
    height: 300px;
  }
}
</style>
