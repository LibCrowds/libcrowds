<template>
  <card-base :title="title" :description="description">
    <b-card-body v-if="canDelete">
      <b-alert show variant="danger">
        <strong>Danger:</strong> Deleting a project is final, there is no undo!
      </b-alert>
    </b-card-body>
    <b-card-body v-else>
      <b-alert show variant="warning">
        You cannot delete this project as tasks have already been completed
        and final results generated.
      </b-alert>
    </b-card-body>
    <b-card-footer>
      <div class="d-flex">
        <b-btn
          variant="danger"
          class="ml-auto"
          :disabled="!canDelete"
          @click="deleteProject">
          Delete
        </b-btn>
      </div>
    </b-card-footer>
  </card-base>
</template>

<script>
import { fetchProjectByName } from '@/mixins/fetchProjectByName'
import { deleteDomainObject } from '@/mixins/deleteDomainObject'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchProjectByName, deleteDomainObject, metaTags ],

  data () {
    return {
      title: 'Delete',
      description: 'Permanently delete the project.',
      canDelete: false
    }
  },

  computed: {
    project () {
      return this.$store.state.currentProject
    }
  },

  components: {
    CardBase
  },

  methods: {
    /**
     * Delete the project.
     */
    deleteProject () {
      const id = this.project.id
      if (this.project.nProjects > 0) {
        return
      }
      this.deleteDomainObject('project', id, () => {
        this.$router.push({ name: 'admin-project' })
      })
    }
  },

  created () {
    this.$axios.$get('/api/result', {
      params: {
        all: 1,
        project_id: this.project.id
      }
    }).then(data => {
      this.canDelete = data.length < 1
    })
  }
}
</script>
