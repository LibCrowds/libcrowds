<template>
  <div id="admin-announcements">
    <div class="row">
      <div class="col-sm-12 col-lg-6">
        <card-form
          header="New Announcement"
          :submitText="'Submit'"
          :form="form"
          @success="refreshCurrentAnnouncements">
        </card-form>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 mt-3">
        <b-card
          no-body
          header="Current Announcements">
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
                variant="danger"
                size="sm"
                @click="deleteAnnouncement(announcement.item.id)">
                Delete
              </b-btn>
            </template>

          </b-table>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import swal from 'sweetalert2'
import siteConfig from '@/siteConfig'
import pybossaApi from '@/api/pybossa'
import capitalize from '@/utils/capitalize'
import CardForm from '@/components/forms/CardForm'

export default {
  data: function () {
    return {
      siteConfig: siteConfig,
      announcements: [],
      form: {
        endpoint: '/admin/announcement/new',
        method: 'post',
        model: {},
        schema: {
          fields: [
            {
              model: 'title',
              label: 'Title',
              type: 'input',
              inputType: 'text',
              placeholder: 'Choose a title'
            },
            {
              model: 'body',
              label: 'Body',
              type: 'textArea',
              rows: 3,
              placeholder: 'Write an introduction (use Markdown)'
            }
          ]
        }
      },
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
      this.form.model = data.form
      this.announcements = data.announcements
    },

    /**
     * Delete an announcement.
     * @param {Number} id
     *   The announcement ID.
     */
    deleteAnnouncement (id) {
      swal({
        title: 'Delete Announcement',
        text: 'Are you sure you want to delete this announcement?',
        type: 'warning',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return new Promise(function (resolve, reject) {
            pybossaApi.get('/admin/announcement').then(r => {
              return pybossaApi.post(`/admin/announcement/${id}/delete`, null, {
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
        swal(
          capitalize(r.data.status),
          r.data.flash,
          r.data.status
        )
      }, (dismiss) => {
        swal.close()
      })
    },

    /**
     * Refresh current announcements data.
     */
    refreshCurrentAnnouncements () {
      pybossaApi.get('/admin/announcement').then(r => {
        this.announcements = r.data.announcements
      })
    }
  },

  beforeRouteEnter (to, from, next) {
    let data = {}
    pybossaApi.get('/admin/announcement/new').then(r => {
      data = r.data
      return pybossaApi.get('/admin/announcement')
    }).then(r => {
      data.announcements = r.data.announcements
      next(vm => vm.setData(data))
    })
  }
}
</script>
