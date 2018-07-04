<template>
  <b-table
    responsive
    striped
    hover
    show-empty
    :dark="darkMode"
    :outlined="outlined"
    :items="filteredItems"
    :fields="mergedFields">

    <template slot="name" slot-scope="row">
      <div class="d-flex flex-row align-items-center">
        <small-avatar
          class="mr-1"
          :info="row.item">
        </small-avatar>
        <a :href="row.item.source" target="_blank">
          {{ row.item.name }}
        </a>
      </div>
    </template>

    <template slot="actions" slot-scope="row">
      <b-btn
        v-if="showDetails"
        variant="info"
        size="sm"
        block
        @click="row.toggleDetails">
        {{ row.detailsShowing ? 'Hide' : 'Show' }} Projects
      </b-btn>
      <slot name="action" :item="row.item"></slot>
    </template>

    <template slot="row-details" slot-scope="row">
      <b-card
        :bg-variant="darkMode ? 'dark' : null"
        :text-variant="darkMode ? 'white' : null">
        <h5>Projects</h5>
        <template v-if="row.item.projects.length">
          <ul class="list-unstyled mb-0">
            <li v-for="project in row.item.projects" :key="project.id">
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
import SmallAvatar from '@/components/avatars/Small'

export default {
  data () {
    return {
      defaultFields: {
        name: {
          label: 'Volume',
          sortable: true
        },
        importer: {
          label: 'Importer',
          class: 'text-center',
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
    outlined: {
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
    mergedFields () {
      const defaultsCopy = JSON.parse(JSON.stringify(this.defaultFields))
      const fields = Object.assign(defaultsCopy, this.extraFields)
      if (this.showDetails) {
        fields.n_ongoing_projects = {
          label: 'Ongoing Projects',
          class: 'text-center',
          sortable: true
        }
        fields.n_completed_projects = {
          label: 'Completed Projects',
          class: 'text-center',
          sortable: true
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
      if (!this.filter || !this.filterBy) {
        return this.volumes
      }

      return this.volumes.filter(item => {
        const value = this.filter.toUpperCase()
        const cell = item[this.filterBy]
        return JSON.stringify(cell).toUpperCase().indexOf(value) > -1
      })
    }
  }
}
</script>
