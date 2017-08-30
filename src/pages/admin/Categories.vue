<template>
  <div id="admin-categories">
    <div class="row">
      <div class="col-sm-12 col-lg-6">
        <card-form
          :header="'New Category'"
          :submitText="'Submit'"
          :endpoint="form.endpoint"
          :schema="form.schema"
          :model="form.model"
          @success="onNewCategorySuccess">
        </card-form>
      </div>
      <div class="hidden-md-down col-lg-6">
        <preview-card
          :fields="previewFields">
        </preview-card>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 mt-3">
        <b-card
          no-block
          :header="'Current Categories'">
          <b-table
            hover
            show-empty
            :items="categories"
            :fields="table.fields">

            <template slot="collection" scope="category">
              {{ category.item.info.collection }}
            </template>

            <template slot="created" scope="category">
              {{ category.item.created | formatDate }}
            </template>

            <template slot="action" scope="category">
              <b-button
                variant="danger"
                size="sm"
                @click="deleteCategory(category.item.id)">
                Delete
              </b-button>
            </template>

          </b-table>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import sweetalert from 'sweetalert'
import siteConfig from '@/siteConfig'
import pybossaApi from '@/api/pybossa'
import CardForm from '@/components/forms/CardForm'
import PreviewCard from '@/components/PreviewCard'

export default {
  data: function () {
    return {
      siteConfig: siteConfig,
      categories: [],
      form: {
        endpoint: '/admin/categories',
        model: {},
        schema: {
          fields: [
            {
              model: 'name',
              label: 'Name',
              type: 'input',
              inputType: 'text',
              placeholder: 'Choose a name'
            },
            {
              model: 'description',
              label: 'Description',
              type: 'textArea',
              rows: 3,
              placeholder: 'Write a description (use Markdown)'
            }
          ]
        }
      },
      table: {
        fields: {
          id: { label: 'ID' },
          collection: { label: 'Collection' },
          name: { label: 'Name' },
          description: { label: 'Description' },
          created: { label: 'Created' },
          action: { label: 'Action' }
        }
      }
    }
  },

  components: {
    CardForm,
    PreviewCard
  },

  computed: {
    previewFields: function () {
      return [
        {
          value: this.form.model.name,
          placeholder: 'short',
          class: 'title'
        },
        {
          value: this.form.model.description,
          placeholder: 'long',
          format: 'markdown'
        }
      ]
    }
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      // See https://github.com/LibCrowds/vue-pybossa-frontend/issues/100
      delete data.form.id

      this.form.model = data.form
      this.categories = data.categories
    },

    /**
     * Delete a category.
     * @param {Number} id
     *   The category ID.
     */
    deleteCategory (id) {
      const endpoint = `/admin/categories/del/${id}`
      sweetalert({
        title: 'Delete Category',
        text: 'Are you sure you want to delete this category?',
        type: 'warning',
        showCancelButton: true,
        closeOnConfirm: false,
        showLoaderOnConfirm: true
      },
      () => {
        pybossaApi.get(endpoint).then(r => {
          return pybossaApi.post(endpoint, null, {
            headers: {
              'X-CSRFToken': r.data.form.csrf
            }
          })
        }).then(r => {
          this.refreshCurrentCategories()
          sweetalert(
            r.data.status.charAt(0).toUpperCase() + r.data.status.slice(1),
            r.data.flash,
            r.data.status
          )
        })
      })
    },

    /**
     * Handle new category success.
     * @param {Object} data
     *   The response data.
     */
    onNewCategorySuccess (data) {
      const newCategory = data.categories.filter(category => {
        return category.name === data.form.name
      })[0]
      this.setCollection(newCategory)
    },

    /**
     * Set the collection for a category.
     * @param {Object} category
     *   The category.
     */
    setCollection (category) {
      const endpoint = `/api/category/${category.id}`
      const user = this.$store.state.currentUser
      sweetalert({
        title: 'Set Collection',
        text: `Available collections: ${Object.keys(siteConfig.collections)}`,
        type: 'input',
        showCancelButton: true,
        closeOnConfirm: false,
        showLoaderOnConfirm: true,
        inputPlaceholder: 'Choose a collection'
      },
      (inputValue) => {
        category.info.collection = inputValue
        pybossaApi.put(
          endpoint,
          {
            info: category.info
          },
          {
            params: {
              api_key: user.api_key
            }
          }
        ).then(r => {
          this.refreshCurrentCategories()
          sweetalert(
            r.status === 200 ? 'Success' : 'Error',
            r.status === 200 ? 'Item updated' : r.data.exception_msg,
            r.status === 200 ? 'success' : 'error'
          )
        })
      })
    },

    /**
     * Refresh current categories data.
     */
    refreshCurrentCategories () {
      pybossaApi.get('/admin/categories').then(r => {
        this.setData(r.data)
      })
    }
  },

  beforeRouteEnter (to, from, next) {
    pybossaApi.get('/admin/categories').then(r => {
      next(vm => vm.setData(r.data))
    })
  }
}
</script>
