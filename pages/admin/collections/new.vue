<template>
  <div id="admin-collections-new">
    <pybossa-form
      header="New Collection"
      :form="form"
      class="mb-4"
      @success="onSuccess"
      @cancel="onCancel">
    </pybossa-form>
  </div>
</template>

<script>
import pybossa from '@/api/pybossa'
import capitalize from 'capitalize'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'dashboards-admin',

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
            },
            {
              model: 'description',
              label: 'Description',
              type: 'textArea',
              rows: 3,
              placeholder: 'Appears on the homepage and as its meta description'
            },
          ]
        }
      },
      nProjects: res.data.n_projects_per_category
    }
  },

  head () {
    return {
      title: `New Collection`
    }
  },

  components: {
    PybossaForm
  },

  methods: {
    /**
     * Handle success.
     * @param {Object} data
     *   The response data.
     */
    onSuccess (data) {
      const category = data.categories.filter(category => {
        return category.name === data.form.name
      })[0]
      this.$swal({
        title: 'Microsite created',
        text: 'Click OK to begin configuration',
        type: 'success'
      },
      () => {
        this.$router.push({
          name: 'admin-collections-id-update',
          params: {
            id: category.id
          }
        })
      })
    },

    /**
     * Handle cancel.
     */
    handleCancel () {
      this.$router.push({ name: 'admin-collections' })
    }
  }
}
</script>
