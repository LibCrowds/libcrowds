<template>
  <card-base :title="title" :description="description">
    <p slot="guidance">
      Use the form below to add a new volume to the collection microsite.
    </p>
    <p slot="guidance">
      After adding a volume you will be able to upload a thumbnail image and
      provide the input source, according to the chosen importer type.
    </p>
    <hr class="my-1">
    <pybossa-form
      submit-text="Add Volume"
      :form="form"
      @success="onSuccess">
    </pybossa-form>
  </card-base>
</template>

<script>
import localConfig from '@/local.config'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { getShortname } from '@/mixins/getShortname'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, metaTags, getShortname ],

  data () {
    return {
      title: 'Add a volume',
      description: 'Add a volume to the collection.',
      localConfig: localConfig
    }
  },

  asyncData ({ app, params, error }) {
    const endpoint = `/lc/categories/${params.short_name}/volumes/new`
    return app.$axios.$get(endpoint).then(data => {
      return {
        endpoint: endpoint,
        formModel: data.form,
        importers: data.all_importers
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
    collection () {
      return this.$store.state.currentCollection
    },

    form () {
      const validImporters = [
        'iiif',
        'flickr',
        's3',
        'dropbox'
      ]

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
              onChanged: (model, newVal, oldVal, field) => {
                const newSn = this.getShortname(newVal)
                const oldSn = this.getShortname(oldVal)
                if (!model.short_name || model.short_name === oldSn) {
                  model.short_name = newSn
                }
              },
              hint: 'The name of the volume'
            },
            {
              model: 'short_name',
              label: 'Short Name',
              type: 'input',
              inputType: 'text',
              hint: 'An identifier used, for example, in the file names of ' +
                ' volume-level downloads'
            },
            {
              type: 'select',
              label: 'Importer',
              model: 'importer',
              required: true,
              values: () => this.importers.filter(importer => {
                return validImporters.indexOf(importer) > -1
              }).map(importer => {
                return { id: importer, name: importer }
              }),
              selectOptions: {
                hideNoneSelected: true
              },
              hint: 'The importer type'
            }
          ]
        }
      }
    }
  },

  methods: {
    /**
     * Handle success.
     * @param {Object} data
     *   The returned data.
     */
    onSuccess (data) {
      this.$router.push({
        name: 'admin-collection-short_name-volumes-id',
        params: {
          short_name: this.collection.short_name,
          id: data.new_volume.id
        }
      })
    }
  }
}
</script>
