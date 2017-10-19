<template>
  <div id="admin-collections">
    <b-card
      no-body>
      <div
        slot="header"
        class="mb-0 d-flex align-items-center justify-content-between">
        <h6 class="mb-0">Collections</h6>
        <b-btn
          variant="success"
          size="sm"
          :to="{
            name: 'admin-collections-new'
          }">
          New
        </b-btn>
      </div>

      <b-card-body class="p-0">
        <b-table
          hover
          show-empty
          :items="categories"
          :fields="table.fields">

          <template slot="n_projects" scope="category">
            {{ nProjects[category.item.short_name] }}
          </template>

          <template slot="created" scope="category">
            {{ category.item.created | moment('DD MMMM YYYY') }}
          </template>

          <template slot="action" scope="collection">
            <b-btn
              variant="outline-dark"
              size="sm"
              class="btn-block"
              :to="{
                name: 'admin-collections-id-update',
                params: {
                  id: collection.item.id
                }
              }">
              Update
            </b-btn>
            <b-btn
              variant="danger"
              size="sm"
              class="btn-block"
              @click="deleteCollection(collection.item.id)">
              Delete
            </b-btn>
          </template>

        </b-table>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import pybossa from '@/api/pybossa'
import capitalize from 'capitalize'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'admin-dashboard',

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
    return {
      categories: res.data.categories,
      nProjects: res.data.n_projects_per_category
    }
  },

  head () {
    return {
      title: `Manage Collections`
    }
  },

  components: {
    PybossaForm
  },

  methods: {
    /**
     * Delete a collection.
     * @param {Number} id
     *   The collection ID.
     */
    deleteCollection (id) {
      this.$swal({
        title: 'Delete Collection',
        text: 'Are you sure you want to delete this collection?',
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
    }
  }
}
</script>
