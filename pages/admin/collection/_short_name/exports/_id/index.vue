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

      <div slot="bottom" class="form-group">
        <label>Motivation</label>
        <multiselect
          v-model="formModel.motivation"
          label="name"
          track-by="id"
          :options="motivations">
        </multiselect>
        <div class="hint">
          The annotation motivation.
        </div>
      </div>

      <div slot="bottom" class="form-group">
        <label>Root Template</label>
        <multiselect
          v-model="formModel.root_template_id"
          label="name"
          track-by="id"
          :options="currentCollection.info.templates">
        </multiselect>
        <div class="hint">
          The root template (leave blank to include all data).
        </div>
      </div>

      <div slot="bottom" class="form-group">
        <label>Include</label>
        <multiselect
          v-model="formModel.include"
          label="name"
          track-by="id"
          :options="currentCollection.info.templates"
          :multiple="true">
        </multiselect>
        <div class="hint">
          Include additional templates not already within the chosen hierarchy.
        </div>
      </div>

    </pybossa-form>

  </card-base>
</template>

<script>
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, metaTags ],

  data () {
    return {
      title: 'Add Export Format',
      description: 'Add an export format.',
      motivations: [
        { id: 'describing', name: 'Describing' },
        { id: 'tagging', name: 'Tagging' },
        { id: 'commenting', name: 'Commenting' }
      ]
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
        schema: {
          fields: [
            {
              model: 'name',
              label: 'Name',
              type: 'input',
              inputType: 'text',
              hint: 'A name for the export format.'
            }
          ]
        }
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
