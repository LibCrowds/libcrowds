<template>
  <card-base :title="title" :description="description">
    <b-card-body class="pb-0">
      <p>
        Volumes provide the input used to build tasks for projects. Each
        volume is tracked as a name against a source URI, where the format
        of that source URI depends on the task presenter chosen for the
        collection.
      <p>
        As this collection is currently set to use the
        <strong>{{ collection.info.presenter }}</strong> task presenter the
        source field should be a URI for {{ sourceType }}.
      </p>
      <p>
        After adding a volume you will also be able to upload a thumbnail for
        all projects subsequently created using the volume.
      </p>
      <p>
        See the
        <a :href="localConfig.docs" target="_blank">full documentation</a>
        for further guidance.
      </p>
      <hr class="mt-3">
    </b-card-body>
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
                model: 'source',
                label: 'Source',
                type: 'input',
                inputType: 'url',
                placeholder: `The input source URI`,
                validator: (value) => {
                  const presenter = data.category.info['presenter']
                  const source = value.trim()
                  if (
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
