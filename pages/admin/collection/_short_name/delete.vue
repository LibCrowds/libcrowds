<template>
  <card-base :title="title" :description="description">
    <b-card-body v-if="collection.nProjects.length">
      <b-alert show variant="danger">
        <strong>Danger:</strong> Deleting a collection microsite is final,
        there is no undo!
      </b-alert>
    </b-card-body>
    <b-card-body v-else>
      <b-alert show variant="warning">
        <strong>Warning:</strong> You cannot delete collections that contain
        projects, please move all projects to another collection first.
      </b-alert>
    </b-card-body>
    <b-card-footer>
      <div class="d-flex">
        <b-btn
          variant="danger"
          class="ml-auto"
          :disabled="collection.nProjects === 0"
          @click="deleteCollection">
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

  // Fetch the category and check if it has any projects
  fetch ({ params, app, error, store }) {
    let category = null
    return app.$axios.$get('/api/category', {
      params: {
        short_name: params.short_name
      }
    }).then(categoriesData => {
      if (!categoriesData || categoriesData.length !== 1) {
        error(new Error({ statusCode: 404 }))
        return
      }
      category = categoriesData[0]
      return app.$axios.$get('/api/project', {
        params: {
          category_id: category.id
        }
      })
    }).then(projectsData => {
      category.nProjects = projectsData.length
      store.dispatch('UPDATE_CURRENT_COLLECTION', category)
    }).catch(err => {
      error(err)
    })
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
  }
}
</script>
