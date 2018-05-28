<template>
  <card-base
    :title="title"
    :description="description"
    docs="/templates/parent/">

    <p slot="guidance">
      Use the form below to select the type of parent project from which
      projects using this template must be built.
    </p>
    <p slot="guidance">
      This option is useful for creating chains of projects where the tasks
      that need to be created for one project rely on the results of another.
      For example, you might want to create two project types, one to mark up
      the titles in a set of images and another to transcribe them. In this
      case, the marking up project would be the parent and the transcription
      project would be the child.
    </p>
    <hr class="my-1">

    <pybossa-form
      no-submit
      submit-text="Update"
      :form="form"
      @submit="onSubmit">
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
      title: 'Update Parent Template',
      description: 'Select a parent template.'
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
          fields: [
            {
              model: 'parent_template_id',
              label: 'Parent Template',
              type: 'select',
              values: this.currentCollection.info.templates,
              hint: 'Use the results of a parent project to generate tasks.'
            }
          ]
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
