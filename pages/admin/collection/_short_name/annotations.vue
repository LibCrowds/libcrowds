<template>
  <div>
    <card-base
    :title="title"
    :description="description"
    docs="/collections/annotations/">
      <b-btn
        slot="controls"
        class="float-md-right"
        size="sm"
        variant="success"
        v-b-modal="addAnnoCollectionModalId">
        New
      </b-btn>
      <p slot="guidance">
        Two AnnotationCollections are currently required for each colleciton
        microsite, one to store the results and one to store the user tags.
        To create the AnnotationCollections, click the <strong>New</strong>
        button above.
      </p>
      <p slot="guidance">
        The read-only form fields below give the locations of the current
        AnnotationCollections for this microsite.
      </p>
      <pybossa-form
        submit-text="Update"
        :form="form"
        :show-footer="false"
        @success="onSuccess">
      </pybossa-form>
    </card-base>

     <add-anno-collection-modal
      :collection="currentCollection"
      :modal-id="addAnnoCollectionModalId"
      @success="onSuccess">
    </add-anno-collection-modal>
  </div>
</template>

<script>
import pick from 'lodash/pick'
import { metaTags } from '@/mixins/metaTags'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import PybossaForm from '@/components/forms/PybossaForm'
import VueFormGenerator from 'vue-form-generator'
import CardBase from '@/components/cards/Base'
import AddAnnoCollectionModal from '@/components/modals/AddAnnoCollection'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, metaTags ],

  data () {
    return {
      title: 'Annotations',
      description: `Manage the collection's annotation containers`,
      addAnnoCollectionModalId: 'add-annotation-collection-modal'
    }
  },

  components: {
    AddAnnoCollectionModal,
    PybossaForm,
    CardBase
  },

  computed: {
    currentCollection () {
      return this.$store.state.currentCollection
    },

    form () {
      return {
        endpoint: `/api/category/${this.currentCollection.id}`,
        method: 'put',
        model: pick(
          this.currentCollection,
          'info'
        ),
        schema: {
          fields: [
            {
              model: 'info.annotations.results',
              label: 'Results',
              type: 'input',
              readonly: true,
              inputType: 'text',
              validator: VueFormGenerator.validators.url
            },
            {
              model: 'info.annotations.tags',
              label: 'User tags',
              type: 'input',
              readonly: true,
              inputType: 'text',
              validator: VueFormGenerator.validators.url
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
      this.$notifications.success({ message: 'AnnotationCollections updated' })
    }
  }
}
</script>
