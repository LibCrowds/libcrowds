<template>
  <card-base :title="title" :description="description">

    <pybossa-form
      submit-text="Update"
      :form="form"
      @success="onSuccess">
      <div slot="bottom">
        <label class="ml-0">
          Help content
        </label>
        <markdown-editor
          v-model="project.info.help"
          :configs="markdownConfig">
        </markdown-editor>
      </div>
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
      title: 'Help',
      description: 'Set the help content for the task presenter',
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
          fields: []
        }
      }
    }
  },

  methods: {
    /**
     * Handle form submission success.
     */
    onSuccess () {
      this.notifySuccess({ message: 'Help updated' })
    }
  }
}
</script>
