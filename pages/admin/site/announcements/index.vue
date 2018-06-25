<template>
  <card-base :title="title" :description="description">

    <b-btn
      :variant="darkMode ? 'dark' : 'success'"
      size="sm"
      class="float-md-right"
      slot="controls"
      :to="{
        name: 'admin-site-announcements-new'
      }">
      New
    </b-btn>

    <p slot="guidance">
      Global announcements can be delivered to all users via this page.
      Click the <strong>New</strong> button above to create an announcement.
    </p>

    <infinite-loading-table
      ref="table"
      :fields="tableFields"
      :search-params="searchParams"
      domain-object="announcement">
      <template slot="action" slot-scope="announcement">
        <b-btn
          variant="success"
          size="sm"
          :to="{
            name: 'admin-site-announcements-id',
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
import { metaTags } from '@/mixins/metaTags'
import { deleteDomainObject } from '@/mixins/deleteDomainObject'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-site-dashboard',

  mixins: [ deleteDomainObject, metaTags ],

  data () {
    return {
      title: 'Announcements',
      description: 'Manage global announcements.',
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
