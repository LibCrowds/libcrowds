<template>
  <b-card no-body>
    <div
      slot="header"
      class="mb-0 d-flex align-items-center justify-content-between">
      <span>
        <h6 class="mb-0">{{ title }}</h6>
        <p class="text-muted mb-0">
          <small>
            Set the available tags for the collection.
          </small>
        </p>
      </span>
      <b-btn
        size="sm"
        variant="success"
        @click="addTag">
        Add a tag
      </b-btn>
    </div>
    <b-table
      responsive
      striped
      hover
      show-empty
      :items="tableItems"
      :fields="tableFields">
      <template slot="actions" scope="tag">
        <b-btn
          variant="warning"
          size="sm"
          @click="removeTag(tag.item.tag)">
          Remove
        </b-btn>
      </template>
    </b-table>
  </b-card>
</template>

<script>
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { notifications } from '@/mixins/notifications'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, notifications ],

  middleware: 'is-admin',

  data () {
    return {
      title: 'Tags',
      tableFields: {
        tag: {
          label: 'Tag',
          sortable: true
        },
        actions: {
          label: 'Actions',
          class: 'text-center'
        }
      }
    }
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
      return this.collection.info.tags.map(tag => {
        return { tag: tag }
      })
    }
  },

  methods: {
    /**
     * Handle form success.
     */
    onSuccess () {
      this.notify({
        type: 'success',
        title: 'Success',
        message: 'Collection updated'
      })
    },

    /**
     * Show the add tag alert.
     */
    addTag () {
      this.$swal({
        title: 'Add a tag',
        input: 'text',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        inputValidator: (value) => {
          return new Promise((resolve, reject) => {
            if (this.collection.info.tags.indexOf(value) < 0) {
              resolve()
            } else {
              reject(new Error('That tag already exists!'))
            }
          })
        },
        preConfirm: (value) => {
          this.collection.info.tags.push(value)
          return this.$axios.$put(`/api/category/${this.collection.id}`, {
            info: this.collection.info
          })
        }
      }).then(value => {
        this.notify({
          type: 'success',
          title: 'Success',
          message: `Tag added`
        })
      })
    },

    /**
     * Show the remove tag alert.
     */
    removeTag (tag) {
      this.$swal({
        title: `Delete Tag`,
        text: `Are you sure you want to delete the "${tag}" tag?`,
        type: 'warning',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          const idx = this.collection.info.tags.indexOf(tag)
          this.collection.info.tags.splice(idx, 1)
          return this.$axios.$put(`/api/category/${this.collection.id}`, {
            info: this.collection.info
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
    }
  }
}
</script>
