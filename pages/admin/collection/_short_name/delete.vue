<template>
  <card-base :title="title" :description="description">
    <b-card-body v-if="canDelete">
      <b-alert show variant="danger">
        <strong>Danger:</strong> Deleting a collection microsite is final,
        there is no undo!
      </b-alert>
    </b-card-body>
    <b-card-body v-else-if="!loading">
      <b-alert show variant="warning">
        You cannot delete this collection as it contains active projects.
        Please move all projects to another collection first.
      </b-alert>
    </b-card-body>
    <b-card-footer>
      <div class="d-flex">
        <b-btn
          variant="danger"
          class="ml-auto"
          :disabled="!canDelete"
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
      description: 'Permanently delete the microsite.',
      canDelete: false,
      loading: true
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
      if (this.collection.nProjects > 0) {
        return
      }
      this.deleteDomainObject('category', id, () => {
        this.$router.push({ name: 'admin-collection' })
      })
    }
  },

  created () {
    this.$axios.$get('/api/project', {
      params: {
        all: 1,
        category_id: this.collection.id
      }
    }).then(data => {
      this.canDelete = data.length < 1
      this.loading = false
    })
  }
}
</script>
