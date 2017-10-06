<template>
  <div id="profile">
    <div class="container pt-5 pb-3">
      <b-card v-if="loading">
        <loading
          v-if="loading"
          text="Loading profile">
        </loading>
      </b-card>

      <div class="row" v-else>
        <div class="col-lg-4">
          <user-profile-card
            v-if="user"
            class="mb-3"
            :user="user">
            <b-btn
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
            </b-btn>
          </user-profile-card>
        </div>
        <div class="col-lg-8">

          <user-favourites-card
            class="mb-2"
            v-if="isCurrentUser">
          </user-favourites-card>

          <b-card no-body header="Contributions">
            <b-table
              hover
              striped
              show-empty
              :items="projects"
              :fields="tableFields">
              <template slot="overall_progress" scope="project">
                {{ project.item.overall_progress }}%
              </template>
            </b-table>
          </b-card>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import pybossaApi from '@/api/pybossa'
import UserProfileCard from '@/components/user/ProfileCard'
import UserFavouritesCard from '@/components/user/FavouritesCard'
import ProjectContribButton from '@/components/buttons/ProjectContrib'
import Loading from '@/components/Loading'

export default {
  data: function () {
    return {
      user: {},
      projects: [],
      tableFields: {
        name: { label: 'Name' },
        n_volunteers: { label: 'Volunteers' },
        overall_progress: { label: 'Progress' }
      }
    }
  },

  metaInfo () {
    return {
      title: `${this.user.fullname}: User Profile`
    }
  },

  components: {
    UserProfileCard,
    UserFavouritesCard,
    ProjectContribButton,
    Loading
  },

  computed: {
    isCurrentUser: function () {
      return (
        this.user &&
        this.$store.state.currentUser &&
        this.user.name === this.$store.state.currentUser.name
      )
    },
    loading: function () {
      return isEmpty(this.user)
    }
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      console.log(data)
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

<style>
#profile {
  background-image: url('../../assets/img/geometry.png');
}
</style>
