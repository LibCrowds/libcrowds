<template>
  <div>
    <card-base :title="title" :description="description">
      <b-btn
        slot="controls"
        class="float-right"
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
        class="border-left-0 border-right-0 border-bottom-0"
        :items="getTableItems"
        :fields="tableFields">
        <template slot="color" scope="tag">
          <div
            class="d-flex flex-row align-items-center justify-content-center">
            <b-badge
              class="mr-1"
              :style="`background-color: ${tag.item.color}; width: 1rem;`">
              &nbsp;
            </b-badge>
            {{ tag.item.color }}
          </div>
        </template>
        <template slot="actions" scope="tag">
          <b-btn
            variant="success"
            class="mr-1"
            size="sm"
            @click="editedTag = tag.item"
            v-b-modal="editTagModalId">
            Edit
          </b-btn>
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
      :collection="collection"
      :modal-id="addTagModalId"
      @update="refresh">
    </add-tag-modal>

    <edit-tag-modal
      :collection="collection"
      :modal-id="editTagModalId"
      :tag="editedTag"
      @update="refresh">
    </edit-tag-modal>

  </div>
</template>

<script>
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { notifications } from '@/mixins/notifications'
import { metaTags } from '@/mixins/metaTags'
import AddTagModal from '@/components/modals/AddTag'
import EditTagModal from '@/components/modals/EditTag'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, notifications, metaTags ],

  data () {
    return {
      title: 'Tags',
      description: 'Manage the available tags for the microsite.',
      addTagModalId: 'add-tag-modal',
      editTagModalId: 'edit-tag-modal',
      tableFields: {
        type: {
          label: 'Type',
          sortable: true
        },
        nTags: {
          label: 'Tags',
          sortable: true,
          class: 'text-center'
        },
        color: {
          label: 'Colour',
          class: 'text-center d-none d-sm-block'
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
    EditTagModal,
    CardBase
  },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    }
  },

  methods: {
    /**
     * Return the collection's tags, formatted to be used in the table.
     */
    getTableItems () {
      const items = []
      for (let type of Object.keys(this.collection.info.tags)) {
        const tagType = this.collection.info.tags[type]
        items.push({
          type: type,
          options: tagType.options,
          nTags: tagType.options.length,
          color: tagType.color
        })
      }
      return items
    },

    /**
     * Show the remove tag alert.
     */
    removeTag (tag) {
      this.$swal({
        title: `Delete Tag`,
        text: `Are you sure you want to delete the "${tag.type}" tag type?`,
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          let infoClone = Object.assign({}, this.collection.info)
          delete infoClone.tags[tag.type]
          return this.$axios.$put(`/api/category/${this.collection.id}`, {
            info: infoClone
          }).then(data => {
            this.collection.info = infoClone
          })
        }
      }).then(result => {
        if (result) {
          this.notifySuccess({ message: `Tag deleted` })
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
