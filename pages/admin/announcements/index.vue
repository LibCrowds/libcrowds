<template>
  <div id="admin-announcements">
    <b-card
      no-body>
      <div
        slot="header"
        class="mb-0 d-flex align-items-center justify-content-between">
        <h6 class="mb-0">Announcements</h6>
        <b-btn
          variant="success"
          size="sm"
          :to="{
            name: 'admin-announcement-new'
          }">
          New
        </b-btn>
      </div>

      <b-table
        hover
        show-empty
        :items="announcements"
        :fields="table.fields">

        <template slot="created" scope="announcement">
          {{ announcement.item.created | formatDate }}
        </template>

        <template slot="action" scope="announcement">
          <b-btn
            variant="outline-dark"
            size="sm"
            :to="{
              name: 'admin-announcement-update',
              params: {
                id: announcement.item.id
              }
            }">
            Update
          </b-btn>
          <b-btn
            variant="danger"
            size="sm"
            @click="deleteAnnouncement(announcement.item.id)">
            Delete
          </b-btn>
        </template>

      </b-table>
    </b-card>
  </div>
</template>

<script>
import pybossa from '@/api/pybossa'
import capitalize from 'capitalize'

export default {
  data: function () {
    return {
      announcements: [],
      table: {
        fields: {
          id: {
            label: 'ID',
            class: 'text-center'
          },
          title: {
            label: 'Title'
          },
          body: {
            label: 'Body',
            class: 'd-none d-xl-table-cell'
          },
          created: {
            label: 'Created',
            class: 'text-center'
          },
          action: {
            label: 'Action',
            class: 'text-center'
          }
        }
      }
    }
  },

  metaInfo () {
    return {
      title: `Manage Announcements`
    }
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      this.announcements = data.announcements
    },

    /**
     * Delete an announcement.
     * @param {Number} id
     *   The announcement ID.
     */
    deleteAnnouncement (id) {
      this.$swal({
        title: 'Delete Announcement',
        text: 'Are you sure you want to delete this announcement?',
        type: 'warning',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return new Promise(function (resolve, reject) {
            pybossa.client.get('/admin/announcement').then(r => {
              return pybossa.client.post(`/admin/announcement/${id}/delete`, null, {
                headers: {
                  'X-CSRFToken': r.data.csrf
                }
              })
            }).then(() => {
              resolve()
            })
          })
        }
      }).then(r => {
        this.refreshCurrentAnnouncements()
        this.$store.dispatch('UPDATE_ANNOUNCEMENTS')
        this.$swal(
          capitalize(r.data.status),
          r.data.flash,
          r.data.status
        )
      }, (dismiss) => {
        this.$swal.close()
      })
    },

    /**
     * Refresh current announcements data.
     */
    refreshCurrentAnnouncements () {
      pybossa.getAdminAnnouncements().then(r => {
        this.announcements = r.data.announcements
      })
    }
  },

  beforeRouteEnter (to, from, next) {
    pybossa.getAdminAnnouncements().then(r => {
      next(vm => vm.setData(r.data))
    })
  }
}
</script>
