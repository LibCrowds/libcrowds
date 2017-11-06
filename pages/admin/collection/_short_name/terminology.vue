<template>
  <b-card no-body>
    <div slot="header" class="mb-0">
      <h6 class="mb-0">{{ title }}</h6>
      <p class="text-muted mb-0">
        <small>
          Configure the terminology used within the collection microsite.
        </small>
      </p>
    </div>
    <pybossa-form
      no-border
      submit-text="Update"
      :form="form"
      @success="onSuccess">
    </pybossa-form>
  </b-card>
</template>

<script>
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { notifications } from '@/mixins/notifications'
import pick from 'lodash/pick'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, notifications ],

  data () {
    return {
      title: 'Terminology'
    }
  },

  head () {
    return {
      title: this.title
    }
  },

  components: {
    PybossaForm
  },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    },

    form () {
      return {
        endpoint: `/api/category/${this.collection.id}`,
        method: 'put',
        model: pick(
          this.collection,
          'info'
        ),
        schema: {
          fields: [
            {
              model: 'info.terminology.project',
              label: 'Project',
              type: 'input',
              inputType: 'text'
            },
            {
              model: 'info.terminology.task',
              label: 'Task',
              type: 'input',
              inputType: 'text'
            },
            {
              model: 'info.terminology.taskrun',
              label: 'Task Run',
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
     * Handle form success.
     */
    onSuccess () {
      this.notify({
        type: 'success',
        title: 'Success',
        message: 'Collection updated'
      })
    }
  }
}
</script>
