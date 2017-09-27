<template>
  <div id="forgotten-password">
    <div class="container my-5">
      <div class="col-lg-8 offset-lg-2">
        <b-card
          no-block
          header="Open Project">
          <p class="m-2 lead">
            Use the list below to open the settings pages for a project.
          </p>
          <b-table
            responsive
            striped
            hover
            show-empty
            :items="projects"
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
      projects: [],
      tableFields: {
        name: { label: 'Name' },
        published: { label: 'Published' },
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
      // Add published flag
      data.projects_published = data.projects_published.map(project => {
        project.published = true
        return project
      })
      data.projects_draft = data.projects_draft.map(project => {
        project.published = false
        return project
      })

      this.projects = data.projects_published.concat(data.projects_draft)
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
