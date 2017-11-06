<template>
  <b-card no-body>
    <div slot="header" class="mb-0">
      <h6 class="mb-0">{{ title }}</h6>
      <p class="text-muted mb-0">
        <small>
          Delete the microsite.
        </small>
      </p>
    </div>

    <b-card-body>
      <b-alert show variant="danger">
        <strong>Warning:</strong> Deleting a collection microsite is final,
        there is no undo!
      </b-alert>
    </b-card-body>
    <template slot="footer">
      <div class="d-flex">
        <b-btn
          variant="danger"
          class="ml-auto"
          @click="deleteCollection">
          Delete
        </b-btn>
      </div>
    </template>
  </b-card>
</template>

<script>
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { deleteDomainObject } from '@/mixins/deleteDomainObject'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, deleteDomainObject ],

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
