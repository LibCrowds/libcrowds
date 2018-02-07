<template>
  <card-base :title="title" :description="description">
    <p slot="guidance">
      Volumes provide the input used to build tasks for projects (e.g. the
      images). The format of the volume's source URI depends on the task
      presenter chosen for the collection. As this collection uses the
      <strong>{{ collection.info.presenter }}</strong> task presenter, the
      source field should be a URI for {{ sourceType }}.
    </p>
    <p slot="guidance">
      After adding a volume you will be able to upload a thumbnail image that
      will be used by all projects built from the volume.
    </p>
    <hr>
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
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, metaTags ],

  data () {
    return {
      title: 'Add a volume',
      description: 'Add a volume to the collection.',
      localConfig: localConfig
    }
  },

  asyncData ({ app, params, error }) {
    const endpoint = `/libcrowds/categories/${params.short_name}/volumes/new`
    return app.$axios.$get(endpoint).then(data => {
      return {
        form: {
          endpoint: endpoint,
          method: 'post',
          model: data.form,
          schema: {
            fields: [
              {
                model: 'name',
                label: 'Name',
                type: 'input',
                inputType: 'text',
                placeholder: 'A name for the volume'
              },
              {
                model: 'short_name',
                label: 'Short Name',
                type: 'input',
                inputType: 'text',
                placeholder: 'A short name for the volume',
                hint: 'The short name is used in the file names of any ' +
                  'custom, volume-level downloads.'
              },
              {
                model: 'source',
                label: 'Source',
                type: 'input',
                inputType: 'url',
                placeholder: `The input source URI`,
                validator: (value) => {
                  const presenter = data.category.info['presenter']
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
                  const presenter = data.category.info['presenter']
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
