<template>
  <card-base :title="title" :description="description">
    <b-btn
      slot="controls"
      class="float-right"
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
          @click="editedTemplate = template.item"
          v-b-modal="editTemplateModalId">
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
      addTemplateModalId: 'add-template-modal',
      editTemplateModalId: 'edit-template-modal',
      tableFields: {
        name: {
          label: 'Name',
          sortable: true
        },
        mode: {
          label: 'Mode',
          sortable: true
        },
        field: {
          label: 'Field',
          sortable: true
        },
        actions: {
          label: 'Actions',
          class: 'text-center'
        }
      },
      editedTemplate: {}
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
      const items = []
      for (let shortName of Object.keys(this.collection.info.templates)) {
        const template = this.collection.info.templates[shortName]
        items.push({
          name: template.name,
          mode: template.mode,
          field: template.field
        })
      }
      return items
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
          delete infoClone.templates[template.name]
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
  }
}
</script>
