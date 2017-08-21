<template>
  <div id="admin-announcements">
    <div class="row">
      <div class="col-sm-12 col-lg-6">
        <card-form
          :header="'New Announcement'"
          :submitText="'Submit'"
          :endpoint="form.endpoint"
          :schema="form.schema"
          :model="form.model">
        </card-form>
      </div>
      <div class="hidden-md-down col-lg-6">
        <b-card
          class="bg-faded"
          :header="'Preview'">
          <announcement-card
            show-placeholders
            :announcement="form.model">
          </announcement-card>
        </b-card>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 mt-3">
        <b-card
          no-block
          :header="'Current Announcements'">
          <b-table
            hover
            show-empty
            :items="announcements"
            :fields="table.fields"
            empty-text="No announcements have been made yet">

            <template slot="action" scope="announcement">
              <b-button
                variant="danger"
                size="sm"
                @click="deleteAnnouncement(announcement.item.id)">
                Delete
              </b-button>
            </template>

          </b-table>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import siteConfig from '@/siteConfig'
import pybossaApi from '@/api/pybossa'
import CardForm from '@/components/forms/CardForm'
import AnnouncementCard from '@/components/announcements/AnnouncementCard'

export default {
  data: function () {
    return {
      siteConfig: siteConfig,
      announcements: [],
      form: {
        endpoint: '/admin/announcement/new',
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
              type: 'input',
              inputType: 'textarea',
              placeholder: 'Write an announcement (use Markdown)'
            }
          ]
        }
      },
      table: {
        fields: {
          id: { label: 'ID' },
          title: { label: 'Title' },
          body: { label: 'Body' },
          created: { label: 'Created' },
          user_id: { label: 'User ID' },
          action: { label: 'Action' }
        }
      },
      editCSRF: null
    }
  },

  components: {
    CardForm,
    AnnouncementCard
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
      this.editCSRF = data.editCSRF
    },

    /**
     * Delete an announcement.
     * @param {Number} id
     *   The announcement ID.
     */
    deleteAnnouncement (id) {
      pybossaApi.post(`/admin/announcement/${id}/delete`, null, {
        headers: {
          'X-CSRFToken': this.editCSRF
        }
      }).then(r => {
        if (r.data.status === 'success') {

        }
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
      data.editCSRF = r.data.csrf
      next(vm => vm.setData(data))
    })
  }
}
</script>
