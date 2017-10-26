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

      <infinite-loading-table
        ref="table"
        :fields="tableFields"
        no-border
        domain-object="announcement">
        <template slot="action" scope="announcement">
          <b-btn
            variant="outline-dark"
            size="sm"
            block
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
  layout: 'admin-dashboard',

  mixins: [ deleteDomainObject ],

  data () {
    return {
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
      }
    }
  },

  head () {
    return {
      title: 'Announcements'
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
        this.$store.dispatch('UPDATE_ANNOUNCEMENTS', this.$axios)
      })
    }
  }
}
</script>
