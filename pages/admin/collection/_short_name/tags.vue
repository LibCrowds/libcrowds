<template>
  <b-card no-body>
    <div
      slot="header"
      class="mb-0 d-flex align-items-center justify-content-between">
      <span>
        <h6 class="mb-0">{{ title }}</h6>
        <p class="text-muted mb-0">
          <small>
            Configure the collection microsite.
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
      :items="collection.info.tags"
      :fields="tableFields">
      <template slot="actions" scope="tag">
        <b-btn
          variant="warning"
          size="sm"
          @click="removeTag(tag.item)">
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
      newTag: null,
      tableFields: {
        type: {
          label: 'Type',
          sortable: true
        },
        name: {
          label: 'Name',
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
      let type = ''
      let name = ''

      this.$swal.setDefaults({
        input: 'text',
        showCancelButton: true,
        progressSteps: ['1', '2']
      })

      const steps = [
        {
          title: 'Enter a type',
          text: '(e.g. Location)',
          confirmButtonText: 'Next',
          inputPlaceholder: 'Short types work best',
          inputValidator: (value) => {
            type = value
            return new Promise((resolve, reject) => {
              if (value) {
                resolve()
              } else {
                reject(new Error('The tag type is required'))
              }
            })
          }
        },
        {
          title: 'Enter a name',
          text: '(e.g. London)',
          showLoaderOnConfirm: true,
          inputPlaceholder: 'Short names work best',
          inputValidator: (value) => {
            name = value
            return new Promise((resolve, reject) => {
              const matches = this.collection.info.tags.filter(t => {
                return t.type === type && t.name === name
              })
              if (matches.length > 0) {
                const msg = 'A tag with that name and type already exists'
                reject(new Error(msg))
              } else if (!value) {
                reject(new Error('The tag type is required'))
              } else {
                resolve()
              }
            })
          },
          preConfirm: (value) => {
            this.collection.info.tags.push({
              type: type,
              name: name
            })
            return this.$axios.$put(`/api/category/${this.collection.id}`, {
              info: this.collection.info
            })
          }
        }
      ]

      this.$swal.queue(steps).then(result => {
        this.$swal.resetDefaults()
      }).then(data => {
        this.notify({
          type: 'success',
          title: 'Success',
          message: 'Tag added'
        })
      }, (dismiss) => {
        this.$swal.resetDefaults()
        this.$swal.close()
      })
    },

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
          this.collection.info.tags = this.collection.info.tags.filter(t => {
            return t.type !== tag.type || t.name !== tag.name
          })
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
