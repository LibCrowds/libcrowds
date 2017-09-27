<template>
  <div id="forgotten-password">
    <div class="container my-5">
      <div class="col-lg-8 offset-lg-2">
        <b-card
          no-block
          header="Open Project">
          <h3 class="m-2">Published</h3>
          <b-table
            responsive
            striped
            hover
            show-empty
            :items="projectsPublished"
            :fields="tableFields">
            <template slot="action" scope="project">
              <b-btn
                size="sm"
                variant="success"
                :to="{
                  name: 'project-settings',
                  params: {
                    shortname: project.item.short_name
                  }
                }">
                Open
              </b-btn>
            </template>
          </b-table>
          <h3 class="m-2 mt-3">Draft</h3>
          <b-table
            responsive
            striped
            hover
            show-empty
            :items="projectsDraft"
            :fields="tableFields">
            <template slot="action" scope="project">
              <b-btn
                size="sm"
                variant="success"
                :to="{
                  name: 'project-settings',
                  params: {
                    shortname: project.item.short_name
                  }
                }">
                Open
              </b-btn>
            </template>
          </b-table>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import CardForm from '@/components/forms/CardForm'

export default {
  data: function () {
    return {
      projectsPublished: [],
      projectsDraft: [],
      tableFields: {
        name: { label: 'Name' },
        action: { label: 'Action' }
      }
    }
  },

  metaInfo () {
    return {
      title: `${this.currentUser.fullname}: Open Project`
    }
  },

  props: {
    currentUser: {
      type: Object,
      required: true
    }
  },

  components: {
    CardForm
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      this.projectsPublished = data.projects_published
      this.projectsDraft = data.projects_draft
    }
  },

  beforeRouteEnter (to, from, next) {
    pybossaApi.get(`account/${to.params.username}/projects`).then(r => {
      next(vm => vm.setData(r.data))
    })
  },

  beforeRouteUpdate (to, from, next) {
    pybossaApi.get(`account/${to.params.username}/projects`).then(r => {
      this.setData(r.data)
      next()
    })
  }
}
</script>
