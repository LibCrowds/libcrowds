<template>
  <b-table
    responsive
    striped
    hover
    show-empty
    class="border-left-0 border-right-0 border-bottom-0"
    :items="filteredItems"
    :fields="mergedFields">

    <template slot="name" scope="volume">
      <div class="d-flex flex-row align-items-center">
        <small-avatar
          class="mr-1"
          :info="volume.item">
        </small-avatar>
        <a :href="volume.item.source" target="_blank">
          {{ volume.item.name }}
        </a>
      </div>
    </template>

    <template slot="actions" scope="volume">
      <b-btn
        variant="info"
        size="sm"
        class="mr-1"
        @click="toggleProjectDetails(volume.item)">
        {{ volume.item._showDetails ? 'Hide' : 'Show' }} Projects
      </b-btn>
      <slot name="action" :item="volume.item"></slot>
    </template>

    <template slot="row-details" scope="volume">
      <b-card>
        <h5>Projects</h5>
        <template v-if="volume.item.projects.length">
          <ul class="list-unstyled mb-0">
            <li v-for="project in volume.item.projects" :key="project.id">
              <strong>{{ project.name }}:</strong>
              {{ project.overall_progress }}% complete
            </li>
          </ul>
        </template>
        <p v-else class="mb-0">
          None
        </p>
      </b-card>
    </template>

  </b-table>
</template>

<script>
import merge from 'lodash/merge'
import SmallAvatar from '@/components/avatars/Small'

export default {
  data () {
    return {
      defaultFields: {
        name: {
          label: 'Volume',
          sortable: true
        }
      }
    }
  },

  props: {
    volumes: {
      type: Array,
      required: true
    },
    extraFields: {
      type: Object,
      default: () => ({})
    },
    showDetails: {
      type: Boolean,
      default: false
    },
    noBorder: {
      type: Boolean,
      default: false
    },
    filter: {
      type: String,
      default: null
    },
    filterBy: {
      type: String,
      default: null
    }
  },

  components: {
    SmallAvatar
  },

  computed: {
    tableStyle () {
      if (this.noBorder) {
        return {
          borderLeft: 'none',
          borderRight: 'none'
        }
      }
    },

    mergedFields () {
      const fields = merge({}, this.defaultFields, this.extraFields)
      if (this.showDetails) {
        fields.n_ongoing_projects = {
          label: 'Ongoing Projects',
          class: 'text-center'
        }
        fields.n_completed_projects = {
          label: 'Completed Projects',
          class: 'text-center'
        }
      }
      if (this.showDetails || this.$scopedSlots.action) {
        fields.actions = {
          label: 'Actions',
          class: 'text-center'
        }
      }
      return fields
    },

    filteredItems () {
      const items = this.volumes.map(volume => {
        volume._showDetails = false
        return volume
      })

      if (!this.filter || !this.filterBy) {
        return items
      }

      return items.filter(item => {
        const value = this.filter.toUpperCase()
        const cell = item[this.filterBy]
        return JSON.stringify(cell).toUpperCase().indexOf(value) > -1
      })
    }
  },

  methods: {
    /**
     * Show the project details for a volume.
     * @param {Object} volume
     *   The volume.
     */
    toggleProjectDetails (volume) {
      volume._showDetails = !volume._showDetails
    }
  }
}
</script>
