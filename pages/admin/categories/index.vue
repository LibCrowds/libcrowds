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
            {{ nProjects[category.item.short_name] }}
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
                  name: 'admin-categories-update',
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
                :disabled="nProjects[category.item.short_name] > 0"
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
import capitalize from 'capitalize'
import CardForm from '@/components/forms/CardForm'
import pybossa from '@/api/pybossa'

export default {
  data () {
    return {
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
      }
    }
  },

  async asyncData () {
    const res = await pybossa.getAdminCategories()

    // See https://github.com/LibCrowds/libcrowds/issues/100
    delete res.data.form.id

    return {
      categories: res.data.categories,
      form: {
        endpoint: '/admin/categories',
        method: 'post',
        model: res.data.form,
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
      nProjects: res.data.n_projects_per_category
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
     * Delete a category.
     * @param {Number} id
     *   The category ID.
     */
    deleteCategory (id) {
      this.$swal({
        title: 'Delete Category',
        text: 'Are you sure you want to delete this category?',
        type: 'warning',
        showCancelButton: true,
        closeOnConfirm: false,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return new Promise(function (resolve, reject) {
            pybossa.deleteCategory(id).then(r => {
              resolve()
            })
          })
        }
      }).then(r => {
        this.categories = this.categories.filter(category => {
          return category.id !== id
        })
        this.$swal(
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
      this.$swal({
        title: 'Category added',
        text: 'Click OK to set additional data',
        type: 'success'
      },
      () => {
        this.$router.push({
          name: 'admin-categories-update',
          params: {
            categoryid: category.id
          }
        })
      })
    }
  }
}
</script>
