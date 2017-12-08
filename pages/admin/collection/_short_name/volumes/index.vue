<template>
  <card-base :title="title" :description="description">
    <div class="float-md-right" slot="controls">
      <b-btn
        variant="warning"
        class="mr-1 my-1"
        size="sm"
        @click="deleteAllVolumes">
        Delete All
      </b-btn>
      <b-btn
        variant="success"
        class="my-1"
        size="sm"
        :to="{
          name: 'admin-collection-short_name-volumes-new',
          params: {
            short_name: this.collection.short_name
          }
        }">
        Upload CSV
      </b-btn>
    </div>

    <b-table
      responsive
      striped
      hover
      show-empty
      class="border-left-0 border-right-0 border-bottom-0"
      :items="Object.values(collection.info.volumes)"
      :fields="fields">
      <template slot="source" scope="volume">
        <a :href="volume.item.source" target="_blank">
          {{ volume.item.source }}
        </a>
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
      title: 'Volumes',
      description: `Manage the volumes that provide the input for projects.`,
      fields: {
        name: {
          label: 'Name',
          sortable: true
        },
        source: {
          label: 'Source',
          sortable: true
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
     * Delete the current list of volumes.
     */
    deleteAllVolumes (data) {
      let infoClone = Object.assign({}, this.collection.info)
      infoClone.volumes = {}
      this.$swal({
        title: 'Delete Volumes',
        text: 'Are you sure you want to delete the current list of volumes?',
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this.$axios.$put(`/api/category/${this.collection.id}`, {
            info: infoClone
          })
        }
      }).then(result => {
        if (result) {
          this.collection.info = infoClone
          this.notifySuccess({ message: `All volumes delete` })
        }
      })
    }
  }
}
</script>
