<template>
  <div id="admin-categories">
    <card-form
      :header="'New Category'"
      :submitText="'Submit'"
      :endpoint="form.endpoint"
      :schema="form.schema"
      :model="form.model"
      class="mb-3"
      @success="onNewCategorySuccess">
    </card-form>

    <b-card
      no-block
      :header="'Current Categories'">
      <b-table
        hover
        show-empty
        :items="categories"
        :fields="table.fields">

        <template slot="n_projects" scope="category">
          {{ n_projects[category.item.short_name] }}
        </template>

        <template slot="collection" scope="category">
          {{ category.item.info.collection }}
        </template>

        <template slot="created" scope="category">
          {{ category.item.created | formatDate }}
        </template>

        <template slot="action" scope="category">
          <b-button
            :id="`del-${category.id}`"
            variant="danger"
            size="sm"
            :disabled="n_projects[category.item.short_name] > 0"
            @click="deleteCategory(category.item.id)">
            Delete
          </b-button>
        </template>

      </b-table>
    </b-card>
  </div>
</template>

<script>
import sweetalert from 'sweetalert'
import siteConfig from '@/siteConfig'
import pybossaApi from '@/api/pybossa'
import CardForm from '@/components/forms/CardForm'

export default {
  data: function () {
    return {
      siteConfig: siteConfig,
      categories: [],
      form: {
        endpoint: '/api/category',
        model: {
          name: null,
          short_name: null,
          description: null,
          info: {
            collection: null,
            location: {
              latitude: 0,
              longitude: 0
            }
          }
        },
        schema: {
          fields: [
            {
              model: 'name',
              label: 'Name',
              type: 'input',
              inputType: 'text',
              placeholder: 'Choose a name',
              required: true,
              validator: 'string'
            },
            {
              model: 'description',
              label: 'Description',
              type: 'textArea',
              rows: 3,
              placeholder: 'Write a description (use Markdown)',
              required: true,
              validator: 'string'
            },
            {
              model: 'info.collection',
              label: 'Collection',
              type: 'select',
              values: siteConfig.collections
            },
            {
              model: 'info.location.latitude',
              label: 'Latitude',
              type: 'input',
              inputType: 'number',
              min: -90,
              max: 90
            },
            {
              model: 'info.location.longitude',
              label: 'Longitude',
              type: 'input',
              inputType: 'number',
              min: -180,
              max: 180
            }
          ]
        }
      },
      table: {
        fields: {
          id: { label: 'ID' },
          name: { label: 'Name' },
          collection: { label: 'Collection' },
          n_projects: { label: 'Projects' },
          description: { label: 'Description' },
          created: { label: 'Created' },
          action: { label: 'Action' }
        }
      },
      n_projects: {}
    }
  },

  components: {
    CardForm
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      this.categories = data.categories
      this.n_projects = data.n_projects_per_category
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
        // The user will already be logged in so we shouldn't need the API key
        pybossaApi.put(endpoint, { info: category.info }).then(r => {
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
