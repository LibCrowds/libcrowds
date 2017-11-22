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
import { metaTags } from '@/mixins/metaTags'

export default {
  layout: 'default',

  mixins: [ metaTags ],

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

  components: {
    ProfileCard
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },

    title () {
      return this.user.fullname
    },

    description () {
      return `${this.user.fullname} has contributed to ${this.projects.length}
        projects.`
    },

    isCurrentUser () {
      return (
        this.user &&
        this.currentUser &&
        this.user.name === this.currentUser.name
      )
    }
  }
}
</script>
