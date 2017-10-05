<template>
  <card-form
    header="Project Settings"
    submit-text="Update"
    :form="form">
    <div slot="bottom" class="d-flex form-group mt-1">
      <toggle-button
        :value="model.protect"
        :sync="true"
        :labels="true"
        @change="updateModelBoolean('protect', $event)">
      </toggle-button>
      <label class="ml-1">Require a password</label>
    </div>
    <div slot="bottom" class="d-flex form-group mt-1">
      <toggle-button
        :value="model.allow_anonymous_contributors"
        :sync="true"
        :labels="true"
        @change="updateModelBoolean('allow_anonymous_contributors', $event)">
      </toggle-button>
      <label class="ml-1">Allow anonymous contributors</label>
    </div>
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
     * @param {String} key
     *   The model key.
     * @param {Object} evt
     *   The event.
     */
    updateModelBoolean (key, evt) {
      this.model[key] = evt.value
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
