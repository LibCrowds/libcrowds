<template>
  <div>
    <card-base :title="title" :description="description">
      <b-btn
        slot="controls"
        class="float-md-right"
        size="sm"
        variant="success"
        v-b-modal="addTagModalId">
        Add a tag type
      </b-btn>

      <b-table
        ref="table"
        responsive
        striped
        hover
        show-empty
        :dark="darkMode"
        class="border-left-0 border-right-0 border-bottom-0"
        :items="currentCollection.info.tags"
        :fields="tableFields">
        <template slot="color" slot-scope="tag">
          <div
            :style="`background-color: ${tag.item.color};`"
            class="p-1 text-white">
            <strong>{{ tag.item.color }}</strong>
          </div>
        </template>
        <template slot="actions" slot-scope="tag">
          <b-btn
            variant="warning"
            size="sm"
            @click="removeTag(tag.item)">
            Remove
          </b-btn>
        </template>
      </b-table>
    </card-base>

    <add-tag-modal
      lazy
      :collection="currentCollection"
      :modal-id="addTagModalId"
      @update="refresh">
    </add-tag-modal>

  </div>
</template>

<script>
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { metaTags } from '@/mixins/metaTags'
import AddTagModal from '@/components/modals/AddTag'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, metaTags ],

  data () {
    return {
      title: 'Tags',
      description: 'Manage the available tags for the microsite.',
      addTagModalId: 'add-tag-modal',
      tableFields: {
        name: {
          label: 'Type',
          sortable: true
        },
        color: {
          label: 'Colour',
          class: 'text-center d-none d-sm-table-cell'
        },
        actions: {
          label: 'Actions',
          class: 'text-center'
        }
      },
      editedTag: {}
    }
  },

  components: {
    AddTagModal,
    CardBase
  },

  computed: {
    currentCollection () {
      return this.$store.state.currentCollection
    }
  },

  methods: {
    /**
     * Show the remove tag alert.
     */
    removeTag (tag) {
      this.$swal({
        title: `Delete Tag`,
        text: `Are you sure you want to delete the "${tag.name}" tag type?`,
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          const endpoint = `/api/category/${this.currentCollection.id}`
          let infoClone = Object.assign({}, this.currentCollection.info)
          infoClone.tags = infoClone.tags.filter(t => (t !== tag))

          return this.$axios.$put(endpoint, {
            info: infoClone
          }).then(data => {
            this.currentCollection.info = infoClone
          })
        }
      }).then(result => {
        if (result) {
          this.$notifications.success({ message: `Tag deleted` })
          this.refresh()
        }
      })
    },

    /**
     * Handle a tag being updated.
     */
    refresh () {
      this.$refs.table.refresh()
    }
  }
}
</script>
