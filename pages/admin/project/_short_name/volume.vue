<template>
  <card-base :title="title" :description="description">

    <b-form-input
      slot="controls"
      v-model="filter"
      class="search-control"
      size="sm"
      :placeholder="`Type to search by ${filterBy}`">
    </b-form-input>

    <b-table
      responsive
      striped
      hover
      show-empty
      :dark="darkMode"
      :items="filteredVolumes"
      :fields="fields">
      <template slot="action" scope="volume">
        <b-btn
          variant="success"
          size="sm"
          block
          :disabled="volume.item.name == project.info.volume"
          @click="setVolume(volume.item.name)">
          Select
        </b-btn>
      </template>
    </b-table>
  </card-base>
</template>

<script>
import { notifications } from '@/mixins/notifications'
import { fetchProjectAndCollection } from '@/mixins/fetchProjectAndCollection'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-project-dashboard',

  mixins: [ fetchProjectAndCollection, notifications, metaTags ],

  data () {
    return {
      title: 'Volume',
      description: 'Choose the volume that this project belongs to.',
      fields: {
        name: {
          label: 'Name',
          sortable: true
        },
        action: {
          label: 'Action',
          class: 'text-center'
        }
      },
      filter: null,
      filterBy: 'name'
    }
  },

  components: {
    CardBase
  },

  computed: {
    project () {
      return this.$store.state.currentProject
    },

    volumes () {
      return this.$store.state.currentCollection.info.volumes
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
     * Set the volume for the project.
     * @param {String} volume
     *   The volume.
     */
    setVolume (volume) {
      let infoClone = Object.assign({}, this.project.info)
      infoClone.volume = volume
      this.$axios.$put(`/api/project/${this.project.id}`, {
        info: infoClone
      }).then(data => {
        this.notifySuccess({ message: `Project moved to ${volume}` })
        this.$store.dispatch('UPDATE_CURRENT_PROJECT', data)
      }).catch(err => {
        this.$nuxt.error(err)
      })
    }
  }
}
</script>
