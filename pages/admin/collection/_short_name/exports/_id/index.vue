<template>
  <card-base :title="title" :description="description">
    <p slot="guidance">
      Use the form below to update the custom export format.
    </p>
    <hr class="my-1">

    <pybossa-form
      submit-text="Add Export Format"
      :form="form"
      @success="onSuccess">
    </pybossa-form>

  </card-base>
</template>

<script>
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { metaTags } from '@/mixins/metaTags'
import { customExportSchema } from '@/mixins/forms/customExportSchema'
import CardBase from '@/components/cards/Base'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, metaTags, customExportSchema ],

  data () {
    return {
      title: 'Update Export Format',
      description: 'Update an export format.'
    }
  },

  asyncData ({ app, params, error }) {
    const endpoint = `/lc/categories/${params.short_name}/exports/${params.id}`
    return app.$axios.$get(endpoint).then(data => {
      return {
        endpoint: endpoint,
        formModel: data.form
      }
    }).catch(err => {
      error(err)
    })
  },

  components: {
    CardBase,
    PybossaForm
  },

  computed: {
    currentCollection () {
      return this.$store.state.currentCollection
    },

    form () {
      return {
        endpoint: this.endpoint,
        method: 'post',
        model: this.formModel,
        schema: this.customExportSchema
      }
    }
  },

  methods: {
    /**
     * Handle success.
     */
    onSuccess () {
      this.$router.push({
        name: 'admin-collection-short_name-exports',
        params: {
          short_name: this.currentCollection.short_name
        }
      })
    }
  }
}
</script>
