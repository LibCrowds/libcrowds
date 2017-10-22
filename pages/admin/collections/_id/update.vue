<template>
  <div id="admin-collections-update">
    <pybossa-form
      show-cancel
      header="Update Collection"
      submit-text="Update"
      :form="form"
      class="mb-4"
      @success="onSuccess"
      @cancel="onCancel">
    </pybossa-form>
  </div>
</template>

<script>
import pybossa from '@/api/pybossa'
import pick from 'lodash/pick'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'admin-dashboard',

  async asyncData ({ params }) {
    const res = await pybossa.client.get(`/api/category/${params.id}`)
    const category = res.data
    category.info = category.info || {}
    return {
      category: category
    }
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
        endpoint: `/api/category/${this.category.id}`,
        method: 'put',
        model: pick(
          this.category,
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
              model: 'info.forumUrl',
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
      this.$swal({
        title: 'Collection updated',
        type: 'success'
      },
      this.$router.push({ name: 'admin-collections' }))
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
