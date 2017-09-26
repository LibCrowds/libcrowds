<template>
  <div id="admin-users">

    <div class="row">
      <div class="col-lg-6">
        <card-form
          header="Search"
          submitText="Search"
          :form="form"
          @success="onSuccess">
        </card-form>
      </div>
      <div class="col-lg-6">
        <b-card
          header="Export"
          class="mt-4 mt-lg-0">
          <p class="lead">
            There are currently {{ nUsers }} registered users
          </p>
          <div class="text-right">
            <b-btn
              variant="success">
              Export as CSV
            </b-btn>
            <b-btn
              variant="success">
              Export as JSON
            </b-btn>
          </div>
        </b-card>
      </div>
    </div>

    <transition
      name="fade"
      appear>
      <b-card
        no-block
        v-if="found.length"
        header="Search Results"
        class="mt-4">
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
      </b-card>
    </transition>

    <b-card
      no-block
      header="Administrators"
      class="mt-4">
      <b-table
        hover
        show-empty
        :items="adminUsers"
        :fields="tableFields">

        <template slot="created" scope="user">
          {{ user.item.created | formatDate }}
        </template>

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
  </div>
</template>

<script>
import pybossaApi from '@/api/pybossa'
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
        id: { label: 'ID' },
        name: { label: 'Username' },
        fullname: { label: 'Full name' },
        email_addr: { label: 'Email' },
        created: { label: 'Created' },
        admin: { label: 'Admin' },
        action: { label: 'Action' }
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
      console.log(data.users)
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
        method: user.admin ? 'DELETE' : 'POST',
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
          this.adminUsers = this.adminUsers(adminUser => !user.id)
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

<style lang="scss">
#admin-users {
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 400ms ease;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
