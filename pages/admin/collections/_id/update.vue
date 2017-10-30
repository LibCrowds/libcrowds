<template>
  <b-card
    id="admin-collections-update"
    no-body
    :header="title">

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

    <b-tabs ref="tabs" no-body card>
      <b-tab title="Core Details" active>
        <p slot="top" class="mb-3 mt-2">
          Edit the core details for the collection microsite. When it's ready,
          click the published toggle.
        </p>
        <pybossa-form
          show-cancel
          no-border
          submit-text="Update"
          cancel-text="Back"
          :form="form"
          @success="onSuccess"
          @cancel="onCancel">
        </pybossa-form>
      </b-tab>
      <b-tab title="Content">
        <pybossa-form
          show-cancel
          no-border
          submit-text="Update"
          cancel-text="Back"
          :form="contentForm"
          @success="onSuccess"
          @cancel="onCancel">
          <p slot="top" class="mb-3 mt-2">
            Use the text areas below to write custom content for the
            collection microsite using
            <a :href="gfmDocs" target="_blank">GitHub flavoured Markdown</a>.
            Top level page headings (e.g. &lt;h1&gt;About&lt;/h1&gt;)
            will be added automatically.
          </p>
        </pybossa-form>
      </b-tab>
      <b-tab title="Terminology">
        <pybossa-form
          show-cancel
          no-border
          submit-text="Update"
          cancel-text="Back"
          :form="terminologyForm"
          @success="onSuccess"
          @cancel="onCancel">
          <p slot="top" class="mb-3 mt-2">
            You can use the fields below to modify the domain object
            terminology used throughout the collection microsite.
          </p>
        </pybossa-form>
      </b-tab>

      <b-tab title="Tags">
        <p class="mt-2 mb-0 p-2">
          Tags are used to organise projects within a collection. Each
          unique tag type will be used to create a new multi-select sorting
          field by which the projects within a collection can be filtered.
        </p>
        <div class="d-flex flex-row w-100">
          <b-btn
            size="sm"
            class="mb-2 ml-auto mr-2"
            variant="success"
            @click="addTag">
            Add a tag
          </b-btn>
        </div>
        <b-table
          responsive
          striped
          hover
          show-empty
          :items="collection.info.tags"
          :fields="tagTableFields">
          <template slot="actions" scope="tag">
            <b-btn
              variant="warning"
              size="sm"
              @click="removeTag(tag.item)">
              Remove
            </b-btn>
          </template>
        </b-table>
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
import VueFormGenerator from 'vue-form-generator'
import { fetchCollectionById } from '@/mixins/fetchCollectionById'
import { notifications } from '@/mixins/notifications'
import pick from 'lodash/pick'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'admin-dashboard',

  mixins: [ fetchCollectionById, notifications ],

  data () {
    return {
      gfmDocs: 'https://guides.github.com/features/mastering-markdown/',
      newTag: null,
      tagTableFields: {
        name: {
          label: 'Name',
          sortable: true
        },
        type: {
          label: 'Type',
          class: 'text-center',
          sortable: true
        },
        actions: {
          label: 'Actions',
          class: 'text-center'
        }
      }
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

    title () {
      return `Update ${this.collection.name}`
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
    },

    contentForm () {
      return {
        endpoint: `/api/category/${this.collection.id}`,
        method: 'put',
        model: pick(
          this.collection,
          'info'
        ),
        schema: {
          fields: [
            {
              model: 'info.content.about',
              label: 'About Page',
              type: 'textArea',
              rows: 15,
              placeholder: 'Text for the about page'
            },
            {
              model: 'info.content.contribute',
              label: 'Contribute Page',
              type: 'textArea',
              rows: 15,
              placeholder: 'Text for the contribute page'
            },
            {
              model: 'info.content.data',
              label: 'Data Page',
              type: 'textArea',
              rows: 15,
              placeholder: 'Text for the data page'
            }
          ]
        }
      }
    },

    terminologyForm () {
      return {
        endpoint: `/api/category/${this.collection.id}`,
        method: 'put',
        model: pick(
          this.collection,
          'info'
        ),
        schema: {
          fields: [
            {
              model: 'info.terminology.project',
              label: 'Project',
              type: 'input',
              inputType: 'text'
            },
            {
              model: 'info.terminology.task',
              label: 'Task',
              type: 'input',
              inputType: 'text'
            },
            {
              model: 'info.terminology.taskrun',
              label: 'Task Run',
              type: 'input',
              inputType: 'text'
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
     * Handle form cancel.
     */
    onCancel () {
      this.$router.push({ name: 'admin-collections' })
    },

    /**
     * Show the add tag alert.
     */
    addTag () {
      let type = ''
      let name = ''

      this.$swal.setDefaults({
        input: 'text',
        showCancelButton: true,
        progressSteps: ['1', '2']
      })

      const steps = [
        {
          title: 'Enter a type',
          text: '(e.g. Location)',
          confirmButtonText: 'Next',
          inputPlaceholder: 'Short types work best',
          inputValidator: (value) => {
            type = value
            return new Promise((resolve, reject) => {
              if (value) {
                resolve()
              } else {
                reject(new Error('The tag type is required'))
              }
            })
          }
        },
        {
          title: 'Enter a name',
          text: '(e.g. London)',
          showLoaderOnConfirm: true,
          inputPlaceholder: 'Short names work best',
          inputValidator: (value) => {
            name = value
            return new Promise((resolve, reject) => {
              const matches = this.collection.info.tags.filter(t => {
                return t.type === type && t.name === name
              })
              if (matches.length > 0) {
                const msg = 'A tag with that name and type already exists'
                reject(new Error(msg))
              } else if (!value) {
                reject(new Error('The tag type is required'))
              } else {
                resolve()
              }
            })
          },
          preConfirm: (value) => {
            this.collection.info.tags.push({
              type: type,
              name: name
            })
            return this.$axios.$put(`/api/category/${this.collection.id}`, {
              info: this.collection.info
            })
          }
        }
      ]

      this.$swal.queue(steps).then(result => {
        this.$swal.resetDefaults()
      }).then(data => {
        this.notify({
          type: 'success',
          title: 'Success',
          message: 'Tag added'
        })
      }, (dismiss) => {
        this.$swal.resetDefaults()
        this.$swal.close()
      })
    },

    /**
     * Show the remove tag alert.
     */
    removeTag (tag) {
      this.$swal({
        title: `Delete Tag`,
        text: `Are you sure you want to delete "${tag.type} - ${tag.name}"?`,
        type: 'warning',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          this.collection.info.tags = this.collection.info.tags.filter(t => {
            return t.type !== tag.type || t.name !== tag.name
          })
          return this.$axios.$put(`/api/category/${this.collection.id}`, {
            info: this.collection.info
          })
        }
      }).then(data => {
        this.notify({
          type: 'success',
          title: 'Success',
          message: `Tag deleted`
        })
      }, (dismiss) => {
        this.$swal.close()
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
        this.$nuxt.error({ statusCode: err.statusCode, message: err.message })
      })
    }
  }
}
</script>

<style lang="scss">
#admin-collections-update {
  .tab-content.card-body {
    padding: 0;
  }
}
</style>
