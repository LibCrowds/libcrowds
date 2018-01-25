<template>
  <card-base :title="title" :description="description">

    <b-form-input
      slot="controls"
      v-model="filter"
      class="search-control"
      size="sm"
      :placeholder="`Type to search by ${filterBy}`">
    </b-form-input>

    <volumes-table :volumes="volumes">
      <template slot="action" scope="vol">
        <b-btn
          :variant="vol.item.id !== currentVolumeId ? 'success' : 'warning'"
          size="sm"
          @click="updateVolume(vol.item)">
          {{ vol.item.id !== currentVolumeId ? 'Select' : 'Deselect' }}
        </b-btn>
      </template>
    </volumes-table>
  </card-base>
</template>

<script>
import { notifications } from '@/mixins/notifications'
import { fetchProjectAndCollection } from '@/mixins/fetchProjectAndCollection'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import VolumesTable from '@/components/tables/Volumes'

export default {
  layout: 'admin-project-dashboard',

  mixins: [ fetchProjectAndCollection, notifications, metaTags ],

  data () {
    return {
      title: 'Volume',
      description: 'Choose the volume associated with this project.',
      filter: null,
      filterBy: 'name'
    }
  },

  components: {
    CardBase,
    VolumesTable
  },

  computed: {
    project () {
      return this.$store.state.currentProject
    },

    volumes () {
      return this.$store.state.currentCollection.info.volumes
    },

    currentVolumeId () {
      return this.project.info.volume_id
    },

    /**
     * Filter volumes.
     */
    filteredVolumes () {
      if (!this.filter) {
        return this.volumes
      }

      return this.volumes.filter(volume => {
        const value = this.filter.toUpperCase()
        const cell = volume[this.filterBy]
        return JSON.stringify(cell).toUpperCase().indexOf(value) > -1
      })
    }
  },

  methods: {
    /**
     * Update the volume for the project.
     * @param {Object} volume
     *   The volume.
     */
    updateVolume (volume) {
      let infoClone = Object.assign({}, this.project.info)

      if (this.currentVolumeId === volume.id) {
        infoClone.volume_id = null
      } else {
        infoClone.volume_id = volume.id
      }

      this.$axios.$put(`/api/project/${this.project.id}`, {
        info: infoClone
      }).then(data => {
        this.notifySuccess({ message: 'Volume updated' })
        this.$store.dispatch('UPDATE_CURRENT_PROJECT', data)
      }).catch(err => {
        this.$nuxt.error(err)
      })
    }
  }
}
</script>
