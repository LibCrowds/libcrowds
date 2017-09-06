<template>
  <div id="admin-categories">
    <card-form
      show-cancel
      :header="'Edit Category'"
      :submitText="'Update'"
      :form="form"
      class="mb-4"
      @success="onSuccess"
      @cancel="onCancel">
    </card-form>
  </div>
</template>

<script>
import sweetalert from 'sweetalert'
import pick from 'lodash/pick'
import siteConfig from '@/siteConfig'
import pybossaApi from '@/api/pybossa'
import CardForm from '@/components/forms/CardForm'

export default {
  data: function () {
    return {
      category: {}
    }
  },

  metaInfo () {
    return {
      title: `Edit Category`
    }
  },

  components: {
    CardForm
  },

  computed: {
    form: function () {
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
              values: Object.keys(siteConfig.collections)
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
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      if (!data.category.info) {
        data.category.info = {}
      }
      this.category = data.category
    },

    /**
     * Handle form success.
     */
    onSuccess () {
      sweetalert({
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
  },

  beforeRouteUpdate (to, from, next) {
    pybossaApi.get(`/api/category/${to.params.categoryid}`).then(r => {
      r.data = {
        category: r.data
      }
      this.setData(r.data)
      next()
    })
  },

  beforeRouteEnter (to, from, next) {
    pybossaApi.get(`/api/category/${to.params.categoryid}`).then(r => {
      r.data = {
        category: r.data
      }
      next(vm => vm.setData(r.data))
    })
  }
}
</script>
