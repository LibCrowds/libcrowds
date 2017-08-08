<template>
  <div id="profile">
    <basic-layout
      :background="'faded'"
      navbarType="light"
      :navbarInvertable="false">

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
                  name: 'user-settings',
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

    </basic-layout>
  </div>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import UserProfileCard from '@/components/user/ProfileCard'
import UserFavouritesCard from '@/components/user/FavouritesCard'
import BasicLayout from '@/components/layouts/Basic'
import ProjectTable from '@/components/project/Table'

export default {
  data: function () {
    return {
      user: null,
      projects: []
    }
  },

  props: {
    username: {
      type: String,
      required: true
    }
  },

  components: {
    BasicLayout,
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
     * Set the user profile data.
     */
    setUserData (data) {
      this.user = data.user
      if (data.projects) {
        this.projects = data.projects
      } else if (data.projects_contrib) {
        this.projects = data.projects_contrib
      }
    }
  },

  beforeRouteEnter (to, from, next) {
    const name = to.params.username
    pybossaApi.get(`account/${name}/`).then(r => {
      next(vm => vm.setUserData(r.data))
    }).catch(err => {
      console.log(err)
      window.location.path = '/404'
    })
  },

  beforeRouteUpdate (to, from, next) {
    const name = to.params.username
    this.user = null
    pybossaApi.get(`account/${name}/`).then(r => {
      this.setUserData(r.data)
      next()
    }).catch(err => {
      console.log(err)
      window.location.path = '/404'
    })
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/main';

#profile {

}
</style>
