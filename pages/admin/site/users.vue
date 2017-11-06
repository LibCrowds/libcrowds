<template>
  <div id="admin-users">
    <b-card no-body>

      <template slot="header">
        <h6 class="mb-0">{{ title }}</h6>
        <p class="text-muted mb-0">
          <small>
            Manage registered users.
          </small>
        </p>
      </template>

      <b-card-body class="p-0">
        <b-row no-gutters>
          <b-col lg="4">
            <pybossa-form
              submit-text="Search"
              header="Search"
              :form="form"
              @success="onSuccess">
            </pybossa-form>
          </b-col>
          <b-col lg="8" class="p-2">
            <b-table
              hover
              show-empty
              :items="found"
              :fields="tableFields">

              <template slot="created" scope="user">
                {{ user.item.created | moment('calendar') }}
              </template>

              <template slot="action" scope="user">
                <b-btn
                  :variant="user.item.admin ? 'warning' : 'success'"
                  size="sm"
                  block
                  @click="toggleAdmin(user.item)">
                  {{ getButtonText(user.item) }}
                </b-btn>
              </template>

            </b-table>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>

    <b-row class="mt-4">
      <b-col xl="4">
        <b-card
          header="Export"
          class="text-center">
          <p class="lead">
            {{ nUsers }} users registered
          </p>
          <b-btn
            variant="success"
            class="mt-1"
            block
            size="sm"
            @click="download('csv')">
            Export as CSV
          </b-btn>
          <b-btn
            variant="success"
            class="mt-1"
            block
            size="sm"
            @click="download('json')">
            Export as JSON
          </b-btn>
        </b-card>
      </b-col>
      <b-col xl="8" class="mt-4 mt-xl-0">
        <b-card
          no-body
          header="Current Administrators">
          <b-table
            hover
            show-empty
            :items="adminUsers"
            :fields="tableFields">

            <template slot="action" scope="user">
              <b-btn
                variant="warning"
                size="sm"
                block
                @click="toggleAdmin(user.item)">
                {{ getButtonText(user.item) }}
              </b-btn>
            </template>

          </b-table>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import exportFile from '@/utils/exportFile'
import PybossaForm from '@/components/forms/PybossaForm'

export default {
  layout: 'admin-site-dashboard',

  data () {
    return {
      title: 'Users',
      tableFields: {
        id: {
          label: 'ID',
          class: 'text-center'
        },
        name: {
          label: 'Username'
        },
        email_addr: {
          label: 'Email',
          class: 'd-none d-xl-table-cell'
        },
        action: {
          label: 'Action',
          class: 'text-center'
        }
      }
    }
  },

  async asyncData ({ app, error }) {
    return Promise.all([
      app.$axios.$get('/admin/users'),
      app.$axios.$get('/api/globalstats')
    ]).then(([adminUserData, statsData]) => {
      return {
        nUsers: statsData.n_users,
        adminUsers: adminUserData.users,
        found: adminUserData.found,
        form: {
          endpoint: '/admin/users',
          method: 'post',
          model: adminUserData.form,
          schema: {
            fields: [
              {
                model: 'user',
                label: 'Search Users',
                type: 'input',
                inputType: 'text',
                placeholder: 'Search by name'
              }
            ]
          }
        }
      }
    }).catch(err => {
      error(err)
    })
  },

  head () {
    return {
      title: this.title
    }
  },

  components: {
    PybossaForm
  },

  methods: {
    /**
     * Return the featured button text.
     * @param {Object} user
     *   The user.
     */
    getButtonText (user) {
      return user.admin ? 'Revoke admin rights' : 'Grant admin rights'
    },

    /**
     * Add or remove a user's admin rights.
     * @param {Object} user
     *   The user.
     */
    toggleAdmin (user) {
      this.$axios.$put(`/api/user/${user.id}`, {
        admin: !user.admin
      }).then(data => {
        user.admin = !user.admin
      }).catch(err => {
        this.$nuxt.error(err)
      })
    },

    /**
     * Handle form success.
     */
    onSuccess (data) {
      this.form.model = data.form
      this.found = data.found
    },

    /**
     * Download the user data.
     * @param {String} format
     *   The format to export.
     */
    download (format) {
      this.$axios.$get(`/admin/users/export`, {
        responseType: 'arraybuffer',
        params: {
          format: format
        }
      }).then(data => {
        exportFile(data, 'user_data', format)
      }).catch(err => {
        this.$nuxt.error(err)
      })
    }
  }
}
</script>