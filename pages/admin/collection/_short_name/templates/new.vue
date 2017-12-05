<template>
  <card-base :title="title" :description="description">
    <template-form
      submit-text="Create"
      :processing="processing"
      @submit="addTemplate"
      @cancel="goBack">
    </template-form>
  </card-base>
</template>

<script>
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { notifications } from '@/mixins/notifications'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import TemplateForm from '@/components/forms/Template'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, notifications, metaTags ],

  data () {
    return {
      title: 'New Project Template',
      description: 'Create a project template.',
      processing: false,
      model: {
        'name': '',
        'description': '',
        'objective': '',
        'guidance': '',
        'field': '',
        'parent': null,
        'mode': null
      }
    }
  },

  components: {
    CardBase,
    TemplateForm
  },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    }
  },

  methods: {
    /**
     * Add a template.
     */
    addTemplate () {
      this.collection.info.templates[this.form.model.name] = this.form.model
      return this.$axios.$put(`/api/category/${this.collection.id}`, {
        info: this.collection.info
      }).then(data => {
        this.notifySuccess({ message: 'Template added' })
        this.goBack()
      })
    },

    /**
     * Go back.
     */
    goBack () {
      this.$router.push({
        name: 'admin-collection-short_name-templates',
        params: {
          short_name: this.collection.short_name
        }
      })
    }
  }
}
</script>
