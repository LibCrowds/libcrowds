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
          <pybossa-form
            show-cancel
            no-border
            submit-text="Update"
            cancel-text="Back"
            :form="tagsForm"
            @success="onSuccess"
            @cancel="onCancel">
            <p slot="top" class="mb-3 mt-2">
              Tags can be used to organise projects within a collection.
            </p>
            <hr>
          </pybossa-form>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import 'vue-awesome/icons/eye'
import { notifications } from '@/mixins/notifications'
import pick from 'lodash/pick'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'admin-dashboard',

  mixins: [ notifications ],

  data () {
    return {
      gfmDocs: 'https://help.github.com/articles' +
        '/basic-writing-and-formatting-syntax/',
      newTag: null
    }
  },

  async asyncData ({ params, app, error }) {
    const endpoint = `/api/category/${params.id}`
    return app.$axios.$get(endpoint).then(data => {
      data.info = data.info || {}
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
    },
    tagsForm () {
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
              model: 'newTag',
              label: 'New Tag',
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