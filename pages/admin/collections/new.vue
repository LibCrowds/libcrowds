<template>
  <div id="admin-collections-new">
    <pybossa-form
      :form="form"
      header="New Collection"
      class="mb-4"
      show-cancel
      @success="onSuccess"
      @cancel="onCancel">
    </pybossa-form>
  </div>
</template>

<script>
import { notifications } from '@/mixins/notifications'
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

  async asyncData ({ app, error }) {
    return app.$axios.$get(`/admin/categories`).then(data => {
      // See https://github.com/LibCrowds/libcrowds/issues/100
      delete data.form.id
      return {
        categories: data.categories,
        form: {
          endpoint: '/admin/categories',
          method: 'post',
          model: data.form,
          schema: {
            fields: [
              {
                model: 'name',
                label: 'Name',
                type: 'input',
                inputType: 'text'
              },
              {
                model: 'description',
                label: 'Description',
                type: 'textArea',
                rows: 3,
                placeholder: 'Appears on the microsite homepage and as its ' +
                  'meta description'
              }
            ]
          }
        },
        nProjects: data.n_projects_per_category
      }
    }).catch(err => {
      error({ statusCode: err.statusCode, message: err.message })
    })
  },

  head () {
    return {
      title: 'New Collection'
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
      this.notify({
        type: 'success',
        title: 'Success',
        message: 'Collection created'
      })
      this.$router.push({
        name: 'admin-collections-id-update',
        params: {
          id: category.id
        }
      })
    },

    /**
     * Handle cancel.
     */
    onCancel () {
      this.$router.push({ name: 'admin-collections' })
    }
  },

  mixins: [ notifications ]
}
</script>
