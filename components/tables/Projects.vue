<template>
  <div class="infinite-loading-table">
    <b-table
      hover
      striped
      show-empty
      :items="projects"
      :fields="fields"
      :style="tableStyle"
      @sort-changed="onSortChange">

      <template slot="overall_progress" scope="data">
        {{ data.item.overall_progress }}%
      </template>

      <template slot="created" scope="data">
        {{ data.item.created | moment('calendar') }}
      </template>

      <template slot="updated" scope="data">
        {{ data.item.updated | moment('calendar') }}
      </template>

      <template slot="last_activity" scope="data">
        {{ data.item.updated | moment('calendar') }}
      </template>

      <template slot="actions" scope="data">
        <slot name="action" :item="data.item"></slot>
      </template>

    </b-table>

    <infinite-load-projects
      ref="infiniteload"
      :collection="collection"
      :orderby="sortModel.orderby"
      :desc="sortModel.desc"
      :no-results="noResults"
      v-model="projects">
    </infinite-load-projects>

  </div>
</template>

<script>
import InfiniteLoadProjects from '@/components/InfiniteLoadProjects'

export default {
  data () {
    return {
      projects: [],
      sortModel: {}
    }
  },

  components: {
    InfiniteLoadProjects
  },

  props: {
    collection: {
      type: String,
      required: true
    },
    fields: {
      type: Object,
      default: () => ({})
    },
    noBorder: {
      type: Boolean,
      default: false
    }
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

    tableFields () {
      const fieldsCopy = JSON.parse(JSON.stringify(this.fields))
      if (this.$scopedSlots.action) {
        fieldsCopy.actions = {
          label: 'Actions',
          class: 'text-center'
        }
      }
      return fieldsCopy
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
     * Reset the loaded items.
     */
    reset () {
      this.$refs.infiniteload.reset()
    }
  }
}
</script>
