<template>
  <div>
    <card-base
      :title="title"
      help="Manage the available tags for the microsite">
      <b-btn
        slot="controls"
        class="float-right"
        size="sm"
        variant="success"
        v-b-modal="addTagModalId">
        Add a tag
      </b-btn>

      <b-table
        ref="table"
        responsive
        striped
        hover
        show-empty
        :items="tableItems"
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
            @click="editTag(tag.item)">
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
      ref="addTagModal"
      :collection="collection"
      :modal-id="addTagModalId"
      @update="handleTagUpdate">
    </add-tag-modal>

  </div>
</template>

<script>
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { notifications } from '@/mixins/notifications'
import AddTagModal from '@/components/modals/AddTag'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, notifications ],

  middleware: 'is-admin',

  data () {
    return {
      title: 'Tags',
      addTagModalId: 'add-tag-modal',
      tableFields: {
        type: {
          label: 'Type',
          sortable: true
        },
        name: {
          label: 'Name',
          sortable: true
        },
        color: {
          label: 'Colour',
          class: 'text-center d-none d-lg-block'
        },
        actions: {
          label: 'Actions',
          class: 'text-center'
        }
      }
    }
  },

  components: {
    AddTagModal,
    CardBase
  },

  head () {
    return {
      title: this.title
    }
  },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    },

    tableItems () {
      const items = []
      for (let type of Object.keys(this.collection.info.tags)) {
        const tagType = this.collection.info.tags[type]
        for (let name of tagType.options) {
          items.push({ type: type, name: name, color: tagType.color })
        }
      }
      return items
    }
  },

  methods: {
    /**
     * Show the remove tag alert.
     */
    removeTag (tag) {
      this.$swal({
        title: `Delete Tag`,
        text: `Are you sure you want to delete "${tag.type} - ${tag.name}"?`,
        type: 'warning',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          let infoClone = Object.assign({}, this.collection.info)
          let newOptions = infoClone.tags[tag.type].options
          newOptions = newOptions.filter(name => {
            return tag.name !== name
          })
          if (!newOptions.length) {
            delete infoClone.tags[tag.type]
          } else {
            infoClone.tags[tag.type].options = newOptions
          }
          return this.$axios.$put(`/api/category/${this.collection.id}`, {
            info: infoClone
          }).then(data => {
            this.collection.info = infoClone
          })
        }
      }).then(data => {
        this.notify({
          type: 'success',
          title: 'Success',
          message: `Tag deleted`
        })
      }, (dismiss) => {
        this.$swal.close()
      })
    },

    /**
     * Feed the tag modal with data from the selected tag.
     * @param {Object} tag
     *   The tag
     */
    editTag (tag) {
      this.$refs.addTagModal.tag = tag
      this.$refs.addTagModal.show()
    },

    /**
     * Handle a tag being updated.
     * @param {Object} newTag
     *   The new tag.
     */
    handleTagUpdate (newTag) {
      this.$refs.table.refresh()
    }
  }
}
</script>
