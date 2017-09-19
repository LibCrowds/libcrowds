<template>
  <div id="admin-publications">
    <div class="row">
      <div class="col-sm-12 col-lg-6">
        <card-form
          :header="'New Publication'"
          :submitText="'Submit'"
          :form="form"
          @success="refreshCurrentPublications">
        </card-form>
      </div>
      <div class="hidden-md-down col-lg-6">
        <b-card
          class="bg-faded"
          :header="'Preview'">
          <publication-card
            show-placeholders
            :publication="form.model">
          </publication-card>
        </b-card>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 mt-3">
        <b-card
          no-block
          :header="'Current Publications'">
          <b-table
            hover
            show-empty
            :items="publications"
            :fields="table.fields"
            empty-text="No publications have been linked to yet">

            <template slot="created" scope="publication">
              {{ publication.item.created | formatDate }}
            </template>

            <template slot="action" scope="publication">
              <b-button
                variant="danger"
                size="sm"
                @click="deletePublication(publication.item.id)">
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
import swal from 'sweetalert2'
import siteConfig from '@/siteConfig'
import pybossaApi from '@/api/pybossa'
import capitalize from '@/utils/capitalize'
import CardForm from '@/components/forms/CardForm'
import PublicationCard from '@/components/publications/PublicationCard'

export default {
  data: function () {
    return {
      siteConfig: siteConfig,
      publications: [],
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
          id: { label: 'ID' },
          title: { label: 'Title' },
          body: { label: 'Body' },
          created: { label: 'Created' },
          user_id: { label: 'User ID' },
          action: { label: 'Action' }
        }
      }
    }
  },

  metaInfo () {
    return {
      title: `Manage Publications`
    }
  },

  components: {
    CardForm,
    PublicationCard
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      this.form.model = data.form
      this.publications = data.publications
    },

    /**
     * Delete a publication.
     * @param {Number} id
     *   The publication ID.
     */
    deletePublication (id) {
      swal({
        title: 'Delete Publication',
        text: 'Are you sure you want to delete this publication?',
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
        this.refreshCurrentPublications()
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
     * Refresh current publications data.
     */
    refreshCurrentPublications () {
      pybossaApi.get('/admin/announcement').then(r => {
        this.publications = r.data.announcements
      })
    }
  },

  beforeRouteEnter (to, from, next) {
    let data = {}
    pybossaApi.get('/admin/announcement/new').then(r => {
      data = r.data
      return pybossaApi.get('/admin/announcement')
    }).then(r => {
      data.publications = r.data.announcements
      next(vm => vm.setData(data))
    })
  }
}
</script>
