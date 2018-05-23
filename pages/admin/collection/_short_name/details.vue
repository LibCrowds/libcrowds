<template>
  <card-base
    :title="title"
    :description="description"
    docs="/collections/details/">

    <div slot="controls" class="d-flex align-items-center float-md-right">
      <label class="mr-1 mb-0 toggle-label">
        <strong>Published</strong>
      </label>
      <no-ssr>
        <toggle-button
          :value="currentCollection.info.published"
          :sync="true"
          :labels="true"
          class="mb-0"
          @change="togglePublished">
        </toggle-button>
      </no-ssr>
    </div>

    <p slot="guidance">
      Use the form below to configure the collection microsite.
    </p>
    <hr class="my-1">

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
import { licenses } from '@/mixins/licenses'
import { metaTags } from '@/mixins/metaTags'
import pick from 'lodash/pick'
import PybossaForm from '@/components/forms/PybossaForm'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, licenses, metaTags ],

  data () {
    return {
      title: 'Core Details',
      description: 'Configure the core details for the microsite.'
    }
  },

  components: {
    PybossaForm,
    CardBase
  },

  computed: {
    currentCollection () {
      return this.$store.state.currentCollection
    },

    form () {
      return {
        endpoint: `/api/category/${this.currentCollection.id}`,
        method: 'put',
        model: pick(
          this.currentCollection,
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
              validator: VueFormGenerator.validators.string,
              hint: 'Applies branding throughout the collection microsite.'
            },
            {
              model: 'short_name',
              label: 'Short name',
              type: 'input',
              inputType: 'text',
              required: true,
              validator: VueFormGenerator.validators.string,
              hint: 'An identifier used to form the collection ' +
                'microsite\'s URL'
            },
            {
              model: 'info.tagline',
              label: 'Tagline',
              type: 'input',
              inputType: 'text',
              hint: 'Appears on the collection microsite\'s homepage'
            },
            {
              model: 'description',
              label: 'Description',
              type: 'textArea',
              rows: 3,
              hint: 'Appears on the collection microsite\'s homepage and ' +
                'in the meta description that will be visible to search ' +
                'engines'
            },
            {
              model: 'info.background',
              label: 'Background Image',
              type: 'input',
              inputType: 'text',
              placeholder: 'https://example.com/img.jpg',
              validator: VueFormGenerator.validators.url,
              hint: 'Used to style all of collection microsite\'s main pages'
            },
            {
              model: 'info.logo',
              label: 'Logo',
              type: 'input',
              inputType: 'text',
              placeholder: 'https://example.com/img.jpg',
              validator: VueFormGenerator.validators.url,
              hint: 'Appears on the collection microsite\'s homepage'
            },
            {
              model: 'info.license',
              label: 'Data Reuse License',
              type: 'select',
              values: Object.keys(this.dataLicenses).map(key => {
                return { id: key, name: this.dataLicenses[key].name }
              }),
              hint: 'The license used to release all data produced by ' +
                'project\'s within the collection microsite'
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
      this.$notifications.success({ message: 'Collection updated' })
    },

    /**
     * Publish or unpublish a collection microsite.
     * @param {Object} project
     *   The project.
     */
    togglePublished () {
      const published = this.currentCollection.info.published
      this.currentCollection.info.published = !published
      this.$axios.$put(`/api/category/${this.currentCollection.id}`, {
        info: this.currentCollection.info
      }).then(data => {
        this.$store.dispatch('UPDATE_PUBLISHED_COLLECTIONS', this.$axios)
        this.$notifications.success({
          message: this.currentCollection.info.published
            ? 'Collection microsite published'
            : 'Collection microsite unpublished'
        })
      }).catch(err => {
        this.currentCollection.info.published = published
        this.$nuxt.error(err)
      })
    }
  }
}
</script>
