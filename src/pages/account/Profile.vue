<template>
  <div id="profile">
    <div class="container mt-5 mb-3">
      <div class="row">
        <div class="col-lg-4">
          <user-profile-card
            v-if="user"
            class="mb-3"
            :user="user">
            <b-button
              v-if="isCurrentUser"
              block
              variant="success"
              :to="{
                name: 'account-settings',
                params: {
                  username: user.name
                }
              }">
              Settings
            </b-button>
          </user-profile-card>
        </div>
        <div class="col-lg-8">

          <user-favourites-card
            class="mb-2"
            v-if="isCurrentUser">
          </user-favourites-card>

          <b-card no-block :header="'Contributions'">
            <project-table
              :action="'contribute'"
              :projects="projects">
            </project-table>
          </b-card>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import UserProfileCard from '@/components/user/ProfileCard'
import UserFavouritesCard from '@/components/user/FavouritesCard'
import ProjectTable from '@/components/project/Table'

export default {
  data: function () {
    return {
      user: null,
      projects: []
    }
  },

  components: {
    ProjectTable,
    UserProfileCard,
    UserFavouritesCard
  },

  computed: {
    isCurrentUser: function () {
      return (
        this.user &&
        this.$store.state.currentUser &&
        this.user.name === this.$store.state.currentUser.name
      )
    }
  },

  metaInfo: {
    title: 'Profile'
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      this.user = data.user
      if (data.projects) {
        this.projects = data.projects
      } else if (data.projects_contrib) {
        this.projects = data.projects_contrib
      }
    }
  },

  beforeRouteEnter (to, from, next) {
    pybossaApi.get(`account/${to.params.username}/`).then(r => {
      next(vm => vm.setData(r.data))
    })
  },

  beforeRouteUpdate (to, from, next) {
    this.user = null
    pybossaApi.get(`account/${to.params.username}/`).then(r => {
      this.setData(r.data)
      next()
    })
  }
}
</script>
