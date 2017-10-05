<template>
  <card-form
    header="Project Settings"
    submit-text="Update"
    :form="form"
    @success="onSuccess">
  </card-form>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import CardForm from '@/components/forms/CardForm'

export default {
  data: function () {
    return {
      project: {},
      model: {}
    }
  },

  metaInfo () {
    return {
      title: `${this.project.name}: Settings`
    }
  },

  components: {
    CardForm
  },

  computed: {
    form: function () {
      return {
        endpoint: `project/${this.project.short_name}/update`,
        method: 'post',
        model: this.model,
        schema: {
          fields: [
            {
              model: 'name',
              label: 'Name',
              type: 'input',
              inputType: 'text'
            },
            {
              model: 'short_name',
              label: 'Short name',
              type: 'input',
              inputType: 'text'
            },
            {
              model: 'description',
              label: 'Description',
              type: 'textArea',
              rows: 2,
              placeholder: 'Short description shown on the project cards'
            },
            {
              model: 'webhook',
              label: 'Webhook URL',
              type: 'input',
              inputType: 'text'
            },
            {
              model: 'allow_anonymous_contributors',
              label: 'Allow anonymous contributors',
              type: 'checkbox'
            },
            {
              model: 'protect',
              label: 'Require a password',
              type: 'checkbox'
            },
            {
              model: 'pasword',
              label: 'Password',
              type: 'input',
              inputType: 'text'
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
      this.project = data.project
      this.model = data.form
    },

    /**
     * Redirect the user on form submit success.
     */
    onSuccess (data) {
      console.log(data)
    }
  },

  beforeRouteEnter (to, from, next) {
    pybossaApi.get(`project/${to.params.shortname}/update`).then(r => {
      next(vm => vm.setData(r.data))
    })
  },

  beforeRouteUpdate (to, from, next) {
    pybossaApi.get(`project/${to.params.shortname}/update`).then(r => {
      this.setData(r.data)
      next()
    })
  }
}
</script>
