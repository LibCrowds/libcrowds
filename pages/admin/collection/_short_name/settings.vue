<template>
  <b-card no-body>
    <div
      slot="header"
      class="mb-0 d-flex align-items-center justify-content-between">
      <span>
        <h6 class="mb-0">{{ title }}</h6>
        <p class="text-muted mb-0">
          <small>
            Configure the collection microsite.
          </small>
        </p>
      </span>
      <div class="d-flex align-items-center">
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
    </div>
    <pybossa-form
      no-border
      submit-text="Update"
      :form="form"
      @success="onSuccess">
    </pybossa-form>
  </b-card>
</template>

<script>
import VueFormGenerator from 'vue-form-generator'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { notifications } from '@/mixins/notifications'
import pick from 'lodash/pick'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, notifications ],

  data () {
    return {
      title: 'Settings'
    }
  },

  head () {
    return {
      title: this.title
    }
  },

  components: {
    PybossaForm
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
              model: 'info.presenter',
              label: 'Task Presenter',
              type: 'select',
              values: [
                {
                  id: 'libcrowds-viewer',
                  name: 'LibCrowds Viewer'
                },
                {
                  id: 'z3950',
                  name: 'Z39.50'
                }
              ],
              default: 'libcrowds-viewer'
            },
            {
              model: 'info.license',
              label: 'Data Reuse License',
              type: 'select',
              values: [
                {
                  id: 'CC0',
                  name: 'CC0'
                },
                {
                  id: 'CC_BY',
                  name: 'CC BY'
                },
                {
                  id: 'CC_BY-SA',
                  name: 'CC BY-SA'
                },
                {
                  id: 'CC_BY-ND',
                  name: 'CC BY-ND'
                },
                {
                  id: 'CC_BY-NC',
                  name: 'CC BY-NC'
                },
                {
                  id: 'CC_BY-NC-SA',
                  name: 'CC BY-NC-SA'
                },
                {
                  id: 'CC_BY-NC-ND',
                  name: 'CC_BY-NC-ND'
                }
              ],
              default: 'CC0'
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
      this.notify({
        type: 'success',
        title: 'Success',
        message: 'Collection updated'
      })
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
        this.notify({
          type: 'success',
          title: 'Success',
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
