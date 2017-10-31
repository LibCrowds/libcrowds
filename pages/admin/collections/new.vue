<template>
  <b-card no-body>
    <div slot="header" class="mb-0">
      <span>
        <h6 class="mb-0">{{ title }}</h6>
        <p class="text-muted mb-0">
          <small>
            The collection can be configured on the next page before publishing.
          </small>
        </p>
      </span>
    </div>
    <pybossa-form
      :form="form"
      class="mb-4"
      show-cancel
      @success="onSuccess"
      @cancel="onCancel">
    </pybossa-form>
  </b-card>
</template>

<script>
import { notifications } from '@/mixins/notifications'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'admin-dashboard',

  data () {
    return {
      title: 'New Collection',
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
                inputType: 'text',
                placeholder: 'Choose a name for the collection microsite'
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
      title: this.title
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
