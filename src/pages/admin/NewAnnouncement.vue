<template>
  <card-form
    id="admin-new-announcement"
    header="New Announcement"
    show-cancel
    :form="form"
    @success="onSuccessOrCancel"
    @cancel="onSuccessOrCancel">
  </card-form>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import CardForm from '@/components/forms/CardForm'

export default {
  data: function () {
    return {
      form: {
        endpoint: '/admin/announcement/new',
        method: 'post',
        model: {},
        schema: {
          fields: [
            {
              model: 'title',
              label: 'Title',
              type: 'input',
              inputType: 'text'
            },
            {
              model: 'body',
              label: 'Body',
              type: 'textArea',
              rows: 3,
              placeholder: 'Use Markdown'
            }
          ]
        }
      }
    }
  },

  metaInfo () {
    return {
      title: `New Announcement`
    }
  },

  components: {
    CardForm
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      this.form.model = data.form
    },

    /**
     * Handle success or cancel.
     */
    onSuccessOrCancel () {
      this.$router.push({ name: 'admin-announcements' })
      this.$store.dispatch('UPDATE_ANNOUNCEMENTS')
    }
  },

  beforeRouteEnter (to, from, next) {
    pybossaApi.get('/admin/announcement/new').then(r => {
      next(vm => vm.setData(r.data))
    })
  }
}
</script>
