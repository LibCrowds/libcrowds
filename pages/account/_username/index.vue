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
          <profile-card
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
          </profile-card>
        </div>
        <div class="col-lg-8">
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
import ProfileCard from '@/components/cards/Profile'
import ProjectContribButton from '@/components/buttons/ProjectContrib'
import Loading from '@/components/Loading'
import pybossa from '@/api/pybossa'

export default {
  layout: 'default',

  data: function () {
    return {
      user: {},
      projects: [],
      tableFields: {
        name: { label: 'Name' },
        n_volunteers: {
          label: 'Volunteers',
          class: 'text-center'
        },
        overall_progress: {
          label: 'Progress',
          class: 'text-center'
        }
      }
    }
  },

  metaInfo () {
    return {
      title: `${this.user.fullname}: User Profile`
    }
  },

  components: {
    ProfileCard,
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
      this.user = data.user
      if (data.projects) {
        this.projects = data.projects
      } else if (data.projects_contrib) {
        this.projects = data.projects_contrib
      }
    }
  },

  beforeRouteEnter (to, from, next) {
    pybossa.getAccount(to.params.username).then(r => {
      next(vm => vm.setData(r.data))
    })
  },

  beforeRouteUpdate (to, from, next) {
    this.user = null
    pybossa.getAccount(to.params.username).then(r => {
      this.setData(r.data)
      next()
    })
  }
}
</script>

<style>
#profile {
  background-image: url('~/assets/img/geometry.png');
}
</style>
