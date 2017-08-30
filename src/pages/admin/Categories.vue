<template>
  <div id="admin-categories">
    <card-form
      :header="'New Category'"
      :submitText="'Submit'"
      :endpoint="form.endpoint"
      :schema="form.schema"
      :model="form.model"
      class="mb-4"
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
            :id="`edit-${category.id}`"
            variant="secondary"
            size="sm"
            :to="{
              name: 'admin-edit-category',
              params: {
                categoryid: category.item.id
              }
            }">
            Edit
          </b-button>
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
      // See https://github.com/LibCrowds/vue-pybossa-frontend/issues/100
      delete data.form.id

      this.form.model = data.form
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
      const category = data.categories.filter(category => {
        return category.name === data.form.name
      })[0]
      sweetalert({
        title: 'Category added',
        text: 'Click OK to set additional data',
        type: 'success'
      },
      () => {
        this.$router.push({
          name: 'admin-edit-category',
          params: {
            categoryid: category.id
          }
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
