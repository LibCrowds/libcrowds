<template>
  <div id="admin-users">

    <b-card no-body header="Manage Users">
      <b-card-body class="p-0">
        <b-row no-gutters>
          <b-col lg="4">
            <card-form
              submitText="Search"
              header="Search"
              :form="form"
              @success="onSuccess">
            </card-form>
          </b-col>
          <b-col lg="8" class="p-2">
            <b-table
              hover
              show-empty
              :items="found"
              :fields="tableFields">

              <template slot="created" scope="user">
                {{ user.item.created | formatDate }}
              </template>

              <template slot="action" scope="user">
                <b-btn
                  :variant="user.item.admin ? 'warning' : 'success'"
                  size="sm"
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
            size="sm"
            @click="download('csv')">
            Export as CSV
          </b-btn>
          <b-btn
            variant="success"
            class="mt-1"
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
import FileSaver from 'file-saver'
import CardForm from '@/components/forms/CardForm'

export default {
  data: function () {
    return {
      found: [],
      adminUsers: [],
      nUsers: 0,
      form: {
        endpoint: '/admin/users',
        method: 'post',
        model: {},
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
      },
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

  metaInfo () {
    return {
      title: `Manage Users`
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
      this.adminUsers = data.users
      this.found = data.found
      this.form.model = data.form
      this.nUsers = data.nUsers
    },

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
      pybossaApi({
        method: 'GET',
        url: user.admin
          ? `/admin/users/add/${user.id}`
          : `/admin/users/del/${user.id}`,
        data: this.form.model,
        headers: {
          'X-CSRFToken': this.form.model.csrf
        }
      }).then(r => {
        user.admin = !user.admin
        if (user.admin) {
          this.adminUsers.push(user)
        } else {
          this.adminUsers = this.adminUsers.filter(adminUser => {
            return adminUser.id !== user.id
          })
        }
      }).catch(err => {
        this.$router.push({ name: String(err.response.status) })
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
      if (format !== 'json' && format !== 'csv') {
        throw Error('Invalid format')
      }
      pybossaApi.exportUsers(format).then(res => {
        const blob = new Blob([res.data], {
          type: format === 'csv' ? 'text/csv' : 'application/json'
        })
        const fn = `user_data.${format}`
        FileSaver.saveAs(blob, fn)
      })
    }
  },

  beforeRouteEnter (to, from, next) {
    let data = {}
    pybossaApi.get('/admin/users').then(r => {
      data = r.data
      return pybossaApi.get('/api/globalstats')
    }).then(r => {
      data.nUsers = r.data.n_users
      next(vm => vm.setData(data))
    })
  }
}
</script>
