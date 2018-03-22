<template>
  <div id="profile">
    <div class="container pt-5 pb-3">
      <div class="row">
        <div class="col-lg-4">
          <profile-card
            v-if="user"
            class="mb-3"
            :user="user">
            <b-card-body v-if="isCurrentUser">
              <b-btn
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
            </b-card-body>
          </profile-card>
        </div>
        <div class="col-lg-8">
          <b-card
            no-body
            :bg-variant="darkMode ? 'dark' : null"
            :text-variant="darkMode ? 'white' : null"
            header="Contributions">
            <b-table
              hover
              striped
              show-empty
              :dark="darkMode"
              :items="projects"
              :fields="tableFields">
              <template slot="overall_progress" slot-scope="project">
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
        overall_progress: {
          label: 'Progress',
          class: 'text-center',
          sortable: true
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
