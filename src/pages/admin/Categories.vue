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
          @success="refreshCurrentCategories">
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
      console.log(sweetalert)
      sweetalert({
        title: 'Ajax request example',
        text: 'Submit to run ajax request',
        type: 'info',
        showCancelButton: true,
        closeOnConfirm: false,
        showLoaderOnConfirm: true
      },
      function () {
        setTimeout(function () {
          sweetalert('Ajax request finished!')
        }, 2000)
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
