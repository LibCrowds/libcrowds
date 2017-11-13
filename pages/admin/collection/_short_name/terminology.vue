<template>
  <card-base
    :title="title"
    help="Set the terminology used throughout the microsite">
    <pybossa-form
      no-border
      submit-text="Update"
      :form="form"
      @success="onSuccess">
    </pybossa-form>
  </card-base>
</template>

<script>
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { notifications } from '@/mixins/notifications'
import pick from 'lodash/pick'
import PybossaForm from '@/components/forms/PybossaForm'
import CardBase from '@/components/cards/Base'

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
    PybossaForm,
    CardBase
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
      this.notifySuccess({ message: 'Collection updated' })
    }
  }
}
</script>
