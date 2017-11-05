<template>
  <div id="admin-announcements">
    <b-card
      no-body>
      <div
        slot="header"
        class="mb-0 d-flex align-items-center justify-content-between">
        <span>
          <h6 class="mb-0">{{ title }}</h6>
          <p class="text-muted mb-0">
            <small>
              Announcements will be shown to all users.
            </small>
          </p>
        </span>
        <b-btn
          variant="success"
          size="sm"
          :to="{
            name: 'admin-site-announcements-new'
          }">
          New
        </b-btn>
      </div>

      <infinite-loading-table
        ref="table"
        :fields="tableFields"
        no-border
        :search-params="searchParams"
        domain-object="announcement">
        <template slot="action" scope="announcement">
          <b-btn
            variant="primary"
            size="sm"
            block
            :to="{
              name: 'admin-site-announcements-id-update',
              params: {
                id: announcement.item.id
              }
            }">
            Update
          </b-btn>
          <b-btn
            variant="outline-dark"
            size="sm"
            block
            @click="deleteAnnouncement(announcement.item.id)">
            Delete
          </b-btn>
        </template>
      </infinite-loading-table>
    </b-card>
  </div>
</template>

<script>
import InfiniteLoadingTable from '@/components/tables/InfiniteLoading'
import { deleteDomainObject } from '@/mixins/deleteDomainObject'

export default {
  layout: 'admin-site-dashboard',

  mixins: [ deleteDomainObject ],

  data () {
    return {
      title: 'Announcements',
      tableFields: {
        title: {
          label: 'Content',
          sortable: true
        },
        body: {
          label: 'URL',
          class: 'd-none d-lg-table-cell',
          sortable: true
        },
        created: {
          label: 'Created',
          class: 'text-center d-none d-md-table-cell',
          sortable: true
        }
      },
      searchParams: {
        orderby: 'created',
        desc: true
      }
    }
  },

  head () {
    return {
      title: this.title
    }
  },

  components: {
    InfiniteLoadingTable
  },

  methods: {
    /**
     * Delete an announcement.
     * @param {Number|String} id
     *   The announcement ID.
     */
    deleteAnnouncement (id) {
      this.deleteDomainObject('announcement', id, () => {
        this.$refs.table.reset()
      })
    }
  }
}
</script>
