<template>
  <div class="projects-table">
    <b-table
      hover
      striped
      show-empty
      responsive
      :outlined="outlined"
      :dark="darkMode"
      :items="filteredItems"
      :fields="mergedFields"
      @sort-changed="onSortChange">

      <template slot="name" scope="project">
        {{ project.item.name }}
      </template>

      <template slot="overall_progress" scope="project">
        {{ project.item.overall_progress }}%
      </template>

      <template slot="created" scope="project">
        {{ project.item.created | moment('calendar') }}
      </template>

      <template slot="updated" scope="project">
        {{ project.item.updated | moment('calendar') }}
      </template>

      <template slot="last_activity" scope="project">
        {{ project.item.updated | moment('calendar') }}
      </template>

      <template slot="actions" scope="project">
        <slot name="action" :item="project.item"></slot>
      </template>

    </b-table>

    <infinite-load-projects
      ref="loading"
      :collection="collection"
      :orderby="sortModel.orderby"
      :desc="sortModel.desc"
      v-model="items">
    </infinite-load-projects>

  </div>
</template>

<script>
import merge from 'lodash/merge'
import InfiniteLoadProjects from '@/components/InfiniteLoadProjects'

export default {
  data () {
    return {
      items: [],
      sortModel: {},
      defaultFields: {
        name: {
          label: 'Name'
        },
        overall_progress: {
          label: 'Progress',
          class: 'text-center d-none d-md-table-cell',
          sortable: true
        },
        n_tasks: {
          label: 'Tasks',
          class: 'text-center d-none d-xl-table-cell',
          sortable: true
        },
        created: {
          label: 'Created',
          class: 'text-center d-none d-xl-table-cell',
          sortable: true
        }
      }
    }
  },

  components: {
    InfiniteLoadProjects
  },

  props: {
    collection: {
      type: Object,
      required: true
    },
    fields: {
      type: Object,
      default: () => ({})
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
    },
    restricted: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    mergedFields () {
      const fieldsCopy = merge({}, this.defaultFields, this.fields)
      if (this.$scopedSlots.action) {
        fieldsCopy.actions = {
          label: 'Actions',
          class: 'text-center'
        }
      }
      return fieldsCopy
    },

    currentUser () {
      return this.$store.state.currentUser
    },

    filteredItems () {
      let filtered = JSON.parse(JSON.stringify(this.items))

      if (this.restricted && this.currentUser.admin) {
        filtered = filtered.filter(project => {
          console.log(project, this.currentUser.id)
          return (
            project.owner_id === this.currentUser.id ||
            (
              project.info.hasOwnProperty('owners_ids') &&
              project.info.owners_ids.indexOf(this.currentUser.id) > -1
            )
          )
        })
      }

      if (!this.filter || !this.filterBy) {
        return filtered
      }

      return filtered.filter(item => {
        const value = this.filter.toUpperCase()
        const cell = item[this.filterBy]
        return JSON.stringify(cell).toUpperCase().indexOf(value) > -1
      })
    }
  },

  methods: {
    /**
     * Handle sort change.
     */
    onSortChange (value) {
      this.sortModel = {
        orderby: value.sortBy,
        desc: value.sortDesc
      }
    },

    /**
     * Reset the loaded table data.
     */
    reset () {
      this.$refs.loading.reset()
    }
  }
}
</script>

<style lang="scss" scoped>
.projects-table {
  width: 100%;
}
</style>
