<template>
  <card-base :title="title" :description="description">

    <pybossa-form
      submit-text="Update"
      :form="form"
      @success="onSuccess">
    </pybossa-form>

  </card-base>
</template>

<script>
import pick from 'lodash/pick'
import { fetchProjectByName } from '@/mixins/fetchProjectByName'
import { notifications } from '@/mixins/notifications'
import { metaTags } from '@/mixins/metaTags'
import PybossaForm from '@/components/forms/PybossaForm'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-project-dashboard',

  mixins: [ fetchProjectByName, notifications, metaTags ],

  data () {
    return {
      title: 'Task Presenter',
      description: 'Set task presenter options for the project',
      markdownConfig: {
        spellChecker: false
      }
    }
  },

  components: {
    PybossaForm,
    CardBase
  },

  computed: {
    project () {
      return this.$store.state.currentProject
    },

    form () {
      return {
        endpoint: `/api/project/${this.project.id}`,
        method: 'put',
        model: pick(
          this.project,
          'info'
        ),
        schema: {
          fields: [
            {
              model: 'info.presenter_options.share_text',
              label: 'Share Text',
              type: 'input',
              inputType: 'text'
            },
            {
              model: 'info.presenter_options.noteText',
              label: 'Note Text',
              type: 'input',
              inputType: 'text'
            },
            {
              model: 'info.presenter_options.submitText',
              label: 'Submit Text',
              type: 'input',
              inputType: 'text'
            },
            {
              model: 'info.presenter_options.numberRequired',
              label: 'Number Required',
              type: 'input',
              inputType: 'number'
            }
          ]
        }
      }
    }
  },

  methods: {
    /**
     * Handle form submission success.
     */
    onSuccess () {
      this.notifySuccess({ message: 'Task presenter updated' })
    }
  }
}
</script>
