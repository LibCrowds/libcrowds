<template>
  <card-base :title="title" :description="description">
    <pybossa-form
      :form="form"
      no-border
      submit-text="Create"
      @success="onSuccess">
    </pybossa-form>
  </card-base>
</template>

<script>
import { notifications } from '@/mixins/notifications'
import { metaTags } from '@/mixins/metaTags'
import PybossaForm from '@/components/forms/PybossaForm'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ notifications, metaTags ],

  data () {
    return {
      title: 'New Collection',
      description: 'Create a new collection microsite'
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
                  'its meta description.'
              }
            ]
          }
        }
      }
    }).catch(err => {
      error(err)
    })
  },

  components: {
    PybossaForm,
    CardBase
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
