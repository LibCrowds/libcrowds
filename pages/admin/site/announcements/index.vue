<template>
  <card-base :title="title" help="Manage global announcements">
    <b-btn
      variant="success"
      size="sm"
      class="float-right"
      slot="controls"
      :to="{
        name: 'admin-site-announcements-new'
      }">
      New
    </b-btn>

    <infinite-loading-table
      ref="table"
      :fields="tableFields"
      no-border
      :search-params="searchParams"
      domain-object="announcement">
      <template slot="action" scope="announcement">
        <b-btn
          variant="success"
          class="mr-1"
          size="sm"
          :to="{
            name: 'admin-site-announcements-id-update',
            params: {
              id: announcement.item.id
            }
          }">
          Edit
        </b-btn>
        <b-btn
          variant="warning"
          size="sm"
          @click="deleteAnnouncement(announcement.item.id)">
          Remove
        </b-btn>
      </template>
    </infinite-loading-table>

  </card-base>
</template>

<script>
import InfiniteLoadingTable from '@/components/tables/InfiniteLoading'
import { deleteDomainObject } from '@/mixins/deleteDomainObject'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-site-dashboard',

  mixins: [ deleteDomainObject ],

  data () {
    return {
      title: 'Announcements',
      tableFields: {
        title: {
          label: 'Title',
          sortable: true
        },
        'info.link': {
          label: 'URL',
          class: 'd-none d-xl-table-cell',
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
    InfiniteLoadingTable,
    CardBase
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
