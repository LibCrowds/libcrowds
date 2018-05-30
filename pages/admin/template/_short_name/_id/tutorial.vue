<template>
  <card-base
    :title="title"
    :description="description"
    docs="/templates/tutorial/">

    <p slot="guidance">
      Use the form below to update the tutorial shown when the project first
      loads.
    </p>
    <hr class="my-1">

    <pybossa-form
      no-submit
      submit-text="Update"
      :form="form"
      @submit="onSubmit">
      <div slot="bottom">
        <label class="ml-0">
          Tutorial
        </label>
        <markdown-editor
          v-model="form.model.tutorial"
          :configs="markdownConfig">
        </markdown-editor>
      </div>
    </pybossa-form>

  </card-base>
</template>

<script>
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import PybossaForm from '@/components/forms/PybossaForm'
import { fetchCollectionAndTmpl } from '@/mixins/fetchCollectionAndTmpl'

export default {
  layout: 'admin-template-dashboard',

  mixins: [ metaTags, fetchCollectionAndTmpl ],

  data () {
    return {
      title: 'Update Template Tutorial',
      description: `Edit the project template's tutorial.`,
      markdownConfig: {
        spellChecker: false
      }
    }
  },

  components: {
    CardBase,
    PybossaForm
  },

  computed: {
    currentCollection () {
      return this.$store.state.currentCollection
    },

    currentTemplate () {
      return this.$store.state.currentTemplate
    },

    form () {
      return {
        endpoint: '',
        method: 'post',
        model: this.currentTemplate,
        schema: {
          fields: []
        }
      }
    }
  },

  methods: {
    /**
     * Update the current template on form submission.
     */
    onSubmit () {
      const endpoint = `/api/category/${this.currentCollection.id}`
      return this.$axios.$put(endpoint, {
        info: this.currentCollection.info
      }).then(data => {
        this.$notifications.success({ message: 'Template updated' })
      }).catch(err => {
        this.$notifications.error({ message: err.messag })
      })
    }
  }
}
</script>
