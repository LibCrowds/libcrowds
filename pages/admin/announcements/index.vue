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
            name: 'admin-announcements-new'
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
          {{ announcement.item.created | moment('DD MMMM YYYY, hh:mm') }}
        </template>

        <template slot="action" scope="announcement">
          <b-btn
            variant="outline-dark"
            size="sm"
            class="btn-block"
            :to="{
              name: 'admin-announcements-id-update',
              params: {
                id: announcement.item.id
              }
            }">
            Update
          </b-btn>
          <b-btn
            variant="danger"
            size="sm"
            class="btn-block"
            @click="deleteAnnouncement(announcement.item.id)">
            Delete
          </b-btn>
        </template>

      </b-table>
    </b-card>
  </div>
</template>

<script>
import { notifications } from '@/mixins/notifications'
import pybossa from '@/api/pybossa'

export default {
  layout: 'admin-dashboard',

  async asyncData () {
    const res = await pybossa.getAdminAnnouncements()
    return {
      announcements: res.data.announcements
    }
  },

  data () {
    return {
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

  head () {
    return {
      title: `Manage Announcements`
    }
  },

  methods: {
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
          return pybossa.client.delete(`/api/announcement/${id}`)
        }
      }).then(r => {
        this.announcements = this.announcements.filter(announcement => {
          return announcement.id !== id
        })
        this.notify({
          type: 'success',
          title: 'Success',
          message: 'Announcement deleted'
        })
        this.$store.dispatch('UPDATE_ANNOUNCEMENTS')
      }, (dismiss) => {
        this.$swal.close()
      })
    }
  },

  mixins: [ notifications ]
}
</script>
