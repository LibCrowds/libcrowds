<template>
  <card-base :title="title" :description="description">
    <b-card-body>
      <b-alert show variant="danger">
        <strong>Warning:</strong> Deleting a collection microsite is final,
        there is no undo!
      </b-alert>
    </b-card-body>
    <b-card-footer>
      <div class="d-flex">
        <b-btn
          variant="danger"
          class="ml-auto"
          @click="deleteCollection">
          Delete
        </b-btn>
      </div>
    </b-card-footer>
  </card-base>
</template>

<script>
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { deleteDomainObject } from '@/mixins/deleteDomainObject'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, deleteDomainObject, metaTags ],

  data () {
    return {
      title: 'Delete',
      description: 'Permanently delete the microsite.'
    }
  },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    }
  },

  components: {
    CardBase
  },

  methods: {
    /**
     * Delete the collection.
     */
    deleteCollection () {
      const id = this.collection.id
      this.deleteDomainObject('category', id, () => {
        this.$router.push({ name: 'admin-collection' })
      })
    }
  }
}
</script>
