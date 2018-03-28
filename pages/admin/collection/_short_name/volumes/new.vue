<template>
  <card-base :title="title" :description="description">
    <p slot="guidance">
      Use the form below to add a new volume to the collection microsite.
    </p>
    <p slot="guidance">
      After adding a volume you will be able to upload a thumbnail image that
      will be used by all projects built from the volume.
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
        formData: data.form
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

    sourceType () {
      if (this.collection.info.presenter === 'iiif-annotation') {
        return 'a IIIF manifest'
      } else if (this.collection.info.presenter === 'z3950') {
        return 'a Flickr album'
      }
    },

    form () {
      return {
        endpoint: this.endpoint,
        method: 'post',
        model: this.formData,
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
              model: 'source',
              label: 'Source',
              type: 'input',
              inputType: 'url',
              placeholder: `The input source URI`,
              validator: (value) => {
                const presenter = this.collection.info['presenter']
                const source = value ? value.trim() : null
                if (!source) {
                  return 'This field is required!'
                } else if (
                  presenter === 'iiif-annotation' &&
                  !source.match(/^(https?:\/\/).*\/manifest\.json$/g)
                ) {
                  return 'Not a valid IIIF manifest URI'
                } else if (
                  presenter === 'z3950' &&
                  !source.match(/www.flickr.com\/.+\/albums\/\d+$/g)
                ) {
                  return 'Not a valid Flickr album URI'
                }
              },
              hint: () => {
                const presenter = this.collection.info['presenter']
                if (presenter === 'iiif-annotation') {
                  return 'This should be a valid IIIF manifest URI.'
                } else if (presenter === 'z3950') {
                  return 'This should be a valid Flickr album URI.'
                }
              }
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
        name: 'admin-collection-short_name-volumes',
        params: {
          short_name: this.collection.short_name
        }
      })
    }
  }
}
</script>
