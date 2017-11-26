<template>
  <card-base :title="title" :description="description">
    <b-btn
      slot="controls"
      variant="success"
      class="float-right ml-1"
      size="sm"
      @click="testCelebration(form.model.info.celebration.user)">
      Test user
    </b-btn>
    <b-btn
      slot="controls"
      variant="success"
      class="float-right"
      size="sm"
      @click="testCelebration(form.model.info.celebration.project)">
      Test project
    </b-btn>

    <pybossa-form
      submit-text="Update"
      :form="form"
      @success="onSuccess">
      <div slot="bottom">
        <label class="ml-0">
          User completion
        </label>
        <markdown-editor
          v-model="collection.info.celebration.user"
          :configs="markdownConfig">
        </markdown-editor>
      </div>
      <div slot="bottom">
        <label class="ml-0">
          Project completion
        </label>
        <markdown-editor
          v-model="collection.info.celebration.project"
          :configs="markdownConfig">
        </markdown-editor>
      </div>
    </pybossa-form>
  </card-base>
</template>

<script>
import marked from 'marked'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { notifications } from '@/mixins/notifications'
import { metaTags } from '@/mixins/metaTags'
import pick from 'lodash/pick'
import PybossaForm from '@/components/forms/PybossaForm'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, notifications, metaTags ],

  data () {
    return {
      title: 'Celebration',
      description: 'Configure the celebrations shown on project completion.',
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
              model: 'info.celebration.confetti',
              label: 'Confetti type',
              type: 'select',
              values: [
                {
                  id: 'circle',
                  name: 'Circle'
                },
                {
                  id: 'rect',
                  name: 'Rectangle'
                },
                {
                  id: 'heart',
                  name: 'Heart'
                }
              ]
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
      this.notifySuccess({ message: 'Celebration updated' })
    },

    /**
     * Test a celebration.
     * @param {String} msg
     *   The celebration message.
     */
    testCelebration (msg) {
      this.$confetti.start({
        shape: this.form.model.info.celebration.confetti
      })
      this.$swal({
        html: marked(msg)
      }).then(() => {
        this.$confetti.stop()
      }).catch(err => {
        console.debug(err)
        this.$confetti.stop()
      })
    }
  }
}
</script>
