<template>
  <b-card no-body>
    <div slot="header" class="mb-0">
      <h6 class="mb-0">{{ title }}</h6>
      <p class="text-muted mb-0">
        <small>
          Create a new collection microsite.
        </small>
      </p>
    </div>
    <pybossa-form
      :form="form"
      no-border
      submit-text="Create"
      @success="onSuccess">
    </pybossa-form>
  </b-card>
</template>

<script>
import { notifications } from '@/mixins/notifications'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ notifications ],

  middleware: 'is-admin',

  data () {
    return {
      title: 'New Collection'
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
                placeholder: 'Choose a name'
              },
              {
                model: 'description',
                label: 'Description',
                type: 'textArea',
                rows: 3,
                placeholder: 'This appears on the microsite homepage and as ' +
                  'its meta description'
              }
            ]
          }
        }
      }
    }).catch(err => {
      error(err)
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
      this.$router.push({
        name: 'admin-collection-short_name-settings',
        params: {
          short_name: category.short_name
        }
      })
    }
  },

  beforeMount () {
    this.$store.dispatch('UPDATE_CURRENT_COLLECTION', {})
  }
}
</script>
