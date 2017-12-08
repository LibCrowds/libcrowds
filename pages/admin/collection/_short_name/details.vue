<template>
  <card-base :title="title" :description="description">

    <div slot="controls" class="d-flex align-items-center float-md-right">
      <label class="mr-1 mb-0 toggle-label">
        <strong>Published</strong>
      </label>
      <toggle-button
        :value="collection.info.published"
        :sync="true"
        :labels="true"
        class="mb-0"
        @change="togglePublished">
      </toggle-button>
    </div>

    <pybossa-form
      submit-text="Update"
      :form="form"
      @success="onSuccess">
    </pybossa-form>

  </card-base>
</template>

<script>
import VueFormGenerator from 'vue-form-generator'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { notifications } from '@/mixins/notifications'
import { licenses } from '@/mixins/licenses'
import { metaTags } from '@/mixins/metaTags'
import pick from 'lodash/pick'
import PybossaForm from '@/components/forms/PybossaForm'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, notifications, licenses, metaTags ],

  data () {
    return {
      title: 'Details',
      description: 'Configure the core details for the microsite.'
    }
  },

  components: {
    PybossaForm,
    CardBase
  },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    },

    form () {
      return {
        endpoint: `/api/category/${this.collection.id}`,
        method: 'put',
        model: pick(
          this.collection,
          'name',
          'short_name',
          'description',
          'info'
        ),
        schema: {
          fields: [
            {
              model: 'name',
              label: 'Name',
              type: 'input',
              inputType: 'text',
              required: true,
              validator: VueFormGenerator.validators.string
            },
            {
              model: 'short_name',
              label: 'Short name',
              type: 'input',
              inputType: 'text',
              placeholder: 'Used to form the url',
              required: true,
              validator: VueFormGenerator.validators.string
            },
            {
              model: 'info.tagline',
              label: 'Tagline',
              type: 'input',
              inputType: 'text',
              placeholder: 'Appears on the homepage and as its title'
            },
            {
              model: 'description',
              label: 'Description',
              type: 'textArea',
              rows: 3,
              placeholder: 'Appears on the homepage and as its meta description'
            },
            {
              model: 'info.background',
              label: 'Background Image',
              type: 'input',
              inputType: 'text',
              placeholder: 'https://example.com/img.jpg',
              validator: VueFormGenerator.validators.url
            },
            {
              model: 'info.logo',
              label: 'Logo',
              type: 'input',
              inputType: 'text',
              placeholder: 'https://example.com/img.jpg',
              validator: VueFormGenerator.validators.url
            },
            {
              model: 'info.forum',
              label: 'Forum URL',
              type: 'input',
              inputType: 'url',
              placeholder: 'https://community.example.com/t/collection',
              validator: VueFormGenerator.validators.url
            },
            {
              model: 'info.license',
              label: 'Data Reuse License',
              type: 'select',
              values: Object.keys(this.dataLicenses).map(key => {
                return { id: key, name: this.dataLicenses[key].name }
              }),
              default: 'CC0'
            },
            {
              model: 'info.presenter',
              label: 'Task Presenter',
              type: 'select',
              values: [
                {
                  id: 'iiif-annotation',
                  name: 'IIIF Annotation'
                },
                {
                  id: 'z3950',
                  name: 'Z39.50'
                }
              ]
            }
          ]
        }
      }
    }
  },

  methods: {
    /**
     * Handle form success.
     */
    onSuccess () {
      this.notifySuccess({ message: 'Collection updated' })
    },

    /**
     * Publish or unpublish a collection microsite.
     * @param {Object} project
     *   The project.
     */
    togglePublished () {
      this.collection.info.published = !this.collection.info.published
      this.$axios.$put(`/api/category/${this.collection.id}`, {
        info: this.collection.info
      }).then(data => {
        this.$store.dispatch('UPDATE_PUBLISHED_COLLECTIONS', this.$axios)
        this.notifySuccess({
          message: this.collection.info.published
            ? 'Collection microsite published'
            : 'Collection microsite unpublished'
        })
      }).catch(err => {
        this.collection.info.published = !this.collection.info.published
        this.$nuxt.error(err)
      })
    }
  }
}
</script>
