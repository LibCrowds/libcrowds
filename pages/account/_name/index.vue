<template>
  <div id="profile">
    <div class="container pt-5 pb-3">
      <div class="row">
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
                name: 'account-name-settings-profile',
                params: {
                  name: user.name
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
import ProfileCard from '@/components/cards/Profile'

export default {
  layout: 'default',

  data () {
    return {
      tableFields: {
        name: {
          label: 'Name'
        },
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

  async asyncData ({ params, app, error }) {
    return app.$axios.$get(`/account/${params.name}`).then((data) => {
      return {
        user: data.user,
        projects: data.projects || data.projects_contrib
      }
    }).catch(err => {
      error(err)
    })
  },

  head () {
    return {
      title: `${this.user.fullname}: User Profile`
    }
  },

  components: {
    ProfileCard
  },

  computed: {
    /**
     * Return true if the profile is for the current user, false otherwise.
     */
    isCurrentUser () {
      return (
        this.user &&
        this.$store.state.currentUser &&
        this.user.name === this.$store.state.currentUser.name
      )
    }
  }
}
</script>
