<template>
  <div id="admin-categories">
    <pybossa-form
      show-cancel
      header="Edit Category"
      submit-text="Update"
      :form="form"
      class="mb-4"
      @success="onSuccess"
      @cancel="onCancel">
    </pybossa-form>
  </div>
</template>

<script>
import pick from 'lodash/pick'
import localConfig from '@/local.config'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'dashboard',

  async asyncData ({ params, app }) {
    const res = await app.$pybossa.client.get(`/api/category/${params.id}`)
    const category = res.data
    category.info = category.info || {}
    return {
      category: category
    }
  },

  head () {
    return {
      title: `Edit Category`
    }
  },

  components: {
    PybossaForm
  },

  computed: {
    form () {
      return {
        endpoint: `/api/category/${this.category.id}`,
        method: 'put',
        model: pick(
          this.category,
          'name',
          'short_name',
          'description',
          'info'
        ),
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
              model: 'short_name',
              label: 'Short name',
              type: 'input',
              inputType: 'text',
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
              values: Object.keys(localConfig.collections)
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
      }
    }
  },

  methods: {
    /**
     * Handle form success.
     */
    onSuccess () {
      this.$swal({
        title: 'Category updated',
        type: 'success'
      },
      this.$router.push({ name: 'admin-categories' }))
    },

    /**
     * Handle form cancel.
     */
    onCancel () {
      this.$router.push({ name: 'admin-categories' })
    }
  }
}
</script>
