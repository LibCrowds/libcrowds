<template>
  <card-base :title="title" help="Delete the microsite">
    <b-card-body>
      <b-alert show variant="danger">
        <strong>Warning:</strong> Deleting a collection microsite is final,
        there is no undo!
      </b-alert>
    </b-card-body>
    <template slot="card-footer">
      <div class="d-flex">
        <b-btn
          variant="danger"
          class="ml-auto"
          @click="deleteCollection">
          Delete
        </b-btn>
      </div>
    </template>
  </card-base>
</template>

<script>
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { deleteDomainObject } from '@/mixins/deleteDomainObject'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, deleteDomainObject ],

  middleware: 'is-admin',

  data () {
    return {
      title: 'Delete'
    }
  },

  head () {
    return {
      title: this.title
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
