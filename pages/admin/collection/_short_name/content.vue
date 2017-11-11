<template>
  <b-card id="admin-collection-content" no-body>
    <div slot="header" class="mb-0">
      <h6 class="mb-0">{{ title }}</h6>
      <p class="text-muted mb-0">
        <small>
          Configure the collection microsite page content using Markdown.
        </small>
      </p>
    </div>
    <pybossa-form
      no-border
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
  </b-card>
</template>

<script>
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { notifications } from '@/mixins/notifications'
import pick from 'lodash/pick'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, notifications ],

  middleware: 'is-admin',

  data () {
    return {
      title: 'Content',
      markdownConfig: {
        spellChecker: false
      }
    }
  },

  head () {
    return {
      title: this.title
    }
  },

  components: {
    PybossaForm
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
      this.notify({
        type: 'success',
        title: 'Success',
        message: 'Collection updated'
      })
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
