<template>
  <div id="admin-collections-update">
    <b-card no-body>
      <b-tabs ref="tabs" no-body card>
        <b-tab title="Core Details" active>
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
            <hr>
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
            <hr>
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
                block
                @click="removeTag(tag.item)">
                Remove
              </b-btn>
            </template>
          </b-table>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import { setCollectionDefaults } from '@/utils/setCollectionDefaults'
import { notifications } from '@/mixins/notifications'
import pick from 'lodash/pick'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'admin-dashboard',

  mixins: [ notifications ],

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

  async asyncData ({ params, app, error }) {
    return app.$axios.$get(`/api/category/${params.id}`).then(data => {
      setCollectionDefaults(data)
      return {
        collection: data
      }
    }).catch(err => {
      error({ statusCode: err.statusCode, message: err.message })
    })
  },

  head () {
    return {
      title: `Edit Collection`
    }
  },

  components: {
    PybossaForm
  },

  computed: {
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
              inputType: 'text'
            },
            {
              model: 'short_name',
              label: 'Short name',
              type: 'input',
              inputType: 'text',
              placeholder: 'Used to form the url'
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
              placeholder: 'https://example.com/img.jpg'
            },
            {
              model: 'info.forum',
              label: 'Forum URL',
              type: 'input',
              inputType: 'url',
              placeholder: 'https://community.example.com/t/collection'
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
            },
            {
              model: 'info.published',
              type: 'checkbox',
              label: 'Published',
              default: false
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
      this.$swal({
        title: 'Add a tag',
        html:
          `<input id="tag-type" class="swal2-input" placeholder="Type">
          <input id="tag-name" class="swal2-input" placeholder="Name">`,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          const type = document.querySelector('#tag-type').value
          const name = document.querySelector('#tag-name').value
          const matches = this.collection.info.tags.filter(t => {
            return t.type === type && t.name === name
          })
          if (matches.length > 0) {
            const msg = 'A tag with that name and type already exists'
            this.$swal.showValidationError(msg)
            this.$swal.hideLoading()
          } else if (!name.length || !type.length) {
            this.$swal.showValidationError('Both type and name are required')
            this.$swal.hideLoading()
          } else {
            this.collection.info.tags.push({
              type: type,
              name: name
            })
            return this.$axios.$put(`/api/category/${this.collection.id}`, {
              info: this.collection.info
            })
          }
        }
      }).then(data => {
        this.notify({
          type: 'success',
          title: 'Success',
          message: 'Tag added'
        })
      }, (dismiss) => {
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
