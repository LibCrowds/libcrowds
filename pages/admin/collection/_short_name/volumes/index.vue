<template>
  <card-base :title="title" :description="description">
    <div class="float-md-right" slot="controls">
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
        New
      </b-btn>
    </div>

    <b-table
      responsive
      striped
      hover
      show-empty
      class="border-left-0 border-right-0 border-bottom-0"
      :items="collection.info.volumes"
      :fields="fields">
      <template slot="source" scope="volume">
        <a :href="volume.item.source" target="_blank">
          {{ volume.item.source }}
        </a>
      </template>
      <template slot="actions" scope="volume">
        <b-btn
          variant="warning"
          size="sm"
          @click="deleteVolume(volume.item.id)">
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
     * Delete a volume.
     * @param {String} id
     *   The volume ID.
     */
    deleteVolume (id) {
      const endpoint = `/api/category/${this.collection.id}`
      const infoClone = JSON.parse(JSON.stringify(this.collection.info))
      infoClone.volumes = this.collection.info.volumes.filter(vol => {
        return vol.id !== id
      })
      this.$swal({
        title: `Delete Volume`,
        text: `Are you sure you want to delete this volume?`,
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this.$axios.$put(endpoint, { info: infoClone })
        }
      }).then(result => {
        if (result) {
          this.notifySuccess({
            message: 'Volume deleted'
          })
          console.log(result)
          this.$store.dispatch('UPDATE_CURRENT_COLLECTION', result)
        }
      })
    }
  }
}
</script>
