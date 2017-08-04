<template>
  <b-modal :id="modalId" title="Open Project" @shown="fetchData" size="lg">

    <loading
      v-if="loading"
      text="Loading projects">
    </loading>

    <span v-else>
      <h5 class="p-2 mb-0">Published</h5>
      <b-table
        responsive
        striped
        show-empty
        :items="projectsPublished"
        :fields="fields">
      </b-table>

      <h5 class="p-2 mb-0 mt-1">Draft</h5>
      <b-table
        responsive
        striped
        show-empty
        :items="projectsDraft"
        :fields="fields">
      </b-table>
    </span>

  </b-modal>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import Loading from '@/components/Loading'

export default {
  data: function () {
    return {
      loading: true,
      projectsDraft: [],
      projectsPublished: [],
      fields: {
        name: { label: 'Name' },
        overall_progress: { label: 'Progress' },
        actions: { label: 'Actions' }
      }
    }
  },

  props: {
    modalId: {
      type: String,
      required: true
    }
  },

  components: {
    Loading
  },

  methods: {
    fetchData () {
      const currentUser = this.$store.state.currentUser
      if (!currentUser) {
        return
      }
      pybossaApi.get(`account/${currentUser.name}/projects`).then(r => {
        this.projectsDraft = r.data.projects_draft
        this.projectsPublished = r.data.projects_published
        this.loading = false
      })
    }
  },

  created () {
    this.fetchData()
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/main';

.modal {
  display: block;

  .modal-dialog{
      overflow-y: initial !important
  }

  .modal-content {
    max-height: 500px;
    border-radius: 0;
  }

  .modal-body{
      overflow-y: auto;
  }

  .modal-footer {
    padding: 25px 15px;
  }
}

.table {
  margin-bottom: 0;

  td:not(:first-child) {
    text-align: center;
  }
}
</style>
