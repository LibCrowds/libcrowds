<template>
  <div id="admin-categories">
    <card-form
      header="New Category"
      :form="form"
      class="mb-4"
      @success="onNewCategorySuccess">
    </card-form>

    <b-card
      no-body
      header="Current Categories">
      <b-card-body class="p-0">
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
            <b-btn-group>
              <b-btn
                :id="`edit-${category.id}`"
                variant="info"
                size="sm"
                :to="{
                  name: 'admin-edit-category',
                  params: {
                    categoryid: category.item.id
                  }
                }">
                Edit
              </b-btn>
              <b-btn
                :id="`del-${category.id}`"
                variant="danger"
                size="sm"
                :disabled="n_projects[category.item.short_name] > 0"
                @click="deleteCategory(category.item.id)">
                Delete
              </b-btn>
            </b-btn-group>
          </template>

        </b-table>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import swal from 'sweetalert2'
import siteConfig from '@/siteConfig'
import capitalize from '@/utils/capitalize'
import CardForm from '@/components/forms/CardForm'
import pybossa from '@/api/pybossa'

export default {
  data: function () {
    return {
      siteConfig: siteConfig,
      categories: [],
      form: {
        endpoint: '/admin/categories',
        method: 'post',
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
          id: {
            label: 'ID',
            class: 'text-center'
          },
          name: {
            label: 'Name'
          },
          collection: {
            label: 'Collection',
            class: 'text-center'
          },
          n_projects: {
            label: 'Projects',
            class: 'text-center d-none d-xl-table-cell'
          },
          created: {
            label: 'Created',
            class: 'text-center d-none d-xl-table-cell'
          },
          action: {
            label: 'Action',
            class: 'text-center'
          }
        }
      },
      n_projects: {}
    }
  },

  metaInfo () {
    return {
      title: `Manage Categories`
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
      swal({
        title: 'Delete Category',
        text: 'Are you sure you want to delete this category?',
        type: 'warning',
        showCancelButton: true,
        closeOnConfirm: false,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return new Promise(function (resolve, reject) {
            const endpoint = `/admin/categories/del/${id}`
            pybossa.client.get(endpoint).then(r => {
              return pybossa.client.post(endpoint, null, {
                headers: {
                  'X-CSRFToken': r.data.form.csrf
                }
              })
            }).then(r => {
              resolve()
            })
          })
        }
      }).then(r => {
        this.refreshCurrentCategories()
        swal(
          capitalize(r.data.status),
          r.data.flash,
          r.data.status
        )
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
      swal({
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
      pybossa.getAdminCategories().then(r => {
        this.setData(r.data)
      })
    }
  },

  beforeRouteEnter (to, from, next) {
    pybossa.getAdminCategories().then(r => {
      next(vm => vm.setData(r.data))
    })
  }
}
</script>
