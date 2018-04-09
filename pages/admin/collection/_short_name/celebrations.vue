<template>
  <card-base :title="title" :description="description">
    <div class="float-md-right" slot="controls">
      <b-btn
        variant="success"
        class="mr-1 my-1"
        size="sm"
        @click="testCelebration(form.model.info.celebrations.user)">
        Test user
      </b-btn>
      <b-btn
        slot="controls"
        variant="success"
        class="my-1"
        size="sm"
        @click="testCelebration(form.model.info.celebrations.project)">
        Test project
      </b-btn>
    </div>

    <pybossa-form
      submit-text="Update"
      :form="form"
      @success="onSuccess">
      <div slot="bottom">
        <label class="ml-0">
          User completion
        </label>
        <markdown-editor
          v-model="collection.info.celebrations.user"
          :configs="markdownConfig">
        </markdown-editor>
      </div>
      <div slot="bottom">
        <label class="ml-0">
          Project completion
        </label>
        <markdown-editor
          v-model="collection.info.celebrations.project"
          :configs="markdownConfig">
        </markdown-editor>
      </div>
    </pybossa-form>
  </card-base>
</template>

<script>
import marked from 'marked'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { metaTags } from '@/mixins/metaTags'
import pick from 'lodash/pick'
import PybossaForm from '@/components/forms/PybossaForm'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, metaTags ],

  data () {
    return {
      title: 'Celebrations',
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
              model: 'info.celebrations.confetti',
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
      this.$notifications.success({ message: 'Celebration updated' })
    },

    /**
     * Test a celebration.
     * @param {String} msg
     *   The celebration message.
     */
    testCelebration (msg) {
      this.$confetti.start({
        shape: this.form.model.info.celebrations.confetti
      })
      this.$swal({
        html: marked(msg)
      }).then(() => {
        this.$confetti.stop()
      }).catch(err => {
        this.$confetti.stop()
        if (typeof err === 'object' && err.hasOwnProperty('dismiss')) {
          this.$nuxt.error(err)
        }
      })
    }
  }
}
</script>
