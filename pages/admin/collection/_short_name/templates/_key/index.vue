<template>
  <card-base :title="title" :description="description">
    <template-form
      submit-text="Update"
      show-cancel
      :processing="processing"
      :form-model="formModel"
      @submit="updateTemplate"
      @cancel="goBack">
    </template-form>
  </card-base>
</template>

<script>
import shorthash from 'shorthash'
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
      title: 'Update Project Template',
      description: 'Edit a project template.',
      processing: false
    }
  },

  asyncData ({ params, app, error, store }) {
    return app.$axios.$get('/api/category', {
      params: {
        short_name: params.short_name
      }
    }).then(data => {
      if (
        !data ||
        data.length !== 1 ||
        !data[0].info.templates.hasOwnProperty(params.key)
      ) {
        error({ statusCode: 404 })
        return
      }
      return {
        collection: data[0],
        formModel: data[0].info.templates[params.key]
      }
    }).catch(err => {
      error(err)
    })
  },

  components: {
    CardBase,
    TemplateForm
  },

  methods: {
    /**
     * Add a template.
     */
    updateTemplate (data) {
      const key = this.$route.params.key
      const newKey = shorthash.unique(data.name)
      delete this.collection.info.templates[key]
      this.collection.info.templates[newKey] = data
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
