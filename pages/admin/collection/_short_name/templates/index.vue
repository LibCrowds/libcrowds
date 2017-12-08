<template>
  <card-base :title="title" :description="description">
    <b-btn
      slot="controls"
      class="float-md-right"
      size="sm"
      variant="success"
      :to="{
        name: 'admin-collection-short_name-templates-new',
        params: {
          short_name: this.collection.short_name
        }
      }">
      New
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
      <template slot="actions" scope="template">
        <b-btn
          variant="success"
          class="mr-1"
          size="sm"
          :to="{
            name: 'admin-collection-short_name-templates-key',
            params: {
              short_name: collection.short_name,
              key: template.item.key
            }
          }">
          Edit
        </b-btn>
        <b-btn
          variant="warning"
          size="sm"
          @click="removeTemplate(template.item)">
          Remove
        </b-btn>
      </template>
    </b-table>

  </card-base>
</template>

<script>
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { notifications } from '@/mixins/notifications'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, notifications, metaTags ],

  data () {
    return {
      title: 'Project Templates',
      description: 'Configure the project templates for the microsite.',
      tableFields: {
        name: {
          label: 'Name',
          sortable: true
        },
        mode: {
          label: 'Mode',
          sortable: true
        },
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

  components: {
    CardBase
  },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    }
  },

  methods: {
    /**
     * Return the templates, formatted to be used in the table.
     */
    getTableItems () {
      return Object.keys(this.collection.info.templates).map(key => {
        const template = this.collection.info.templates[key]
        template.key = key
        return template
      })
    },

    /**
     * Show the remove template alert.
     */
    removeTemplate (template) {
      this.$swal({
        title: `Delete Template`,
        text: `Are you sure you want to delete this template?`,
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          let infoClone = Object.assign({}, this.collection.info)
          delete infoClone.templates[template.key]
          return this.$axios.$put(`/api/category/${this.collection.id}`, {
            info: infoClone
          }).then(data => {
            this.collection.info = infoClone
          })
        }
      }).then(result => {
        if (result) {
          this.notifySuccess({ message: `Template deleted` })
          this.refresh()
        }
      })
    },

    /**
     * Refresh the table.
     */
    refresh () {
      this.$refs.table.refresh()
    }
  },

  mounted () {
    console.log(this.collection.info)
  }
}
</script>
