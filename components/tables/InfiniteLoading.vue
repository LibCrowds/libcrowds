<template>
  <div class="infinite-loading-table">
    <b-table
      hover
      striped
      show-empty
      :dark="darkMode"
      :items="filteredItems"
      :fields="tableFields"
      :style="tableStyle"
      @sort-changed="onSortChange">

      <template slot="nTags" scope="data">
        {{ Object.keys(data.item.info.tags || {}).length }}
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

    <infinite-load
      ref="infiniteload"
      :domain-object="domainObject"
      v-model="items"
      :search-params="mergedParams"
      no-more-results="No more results">
    </infinite-load>

  </div>
</template>

<script>
import merge from 'lodash/merge'
import InfiniteLoad from '@/components/InfiniteLoad'

export default {
  data () {
    return {
      items: [],
      sortParams: {}
    }
  },

  components: {
    InfiniteLoad
  },

  props: {
    domainObject: {
      type: String,
      required: true
    },
    searchParams: {
      type: Object,
      default: () => ({})
    },
    filter: {
      type: String,
      default: null
    },
    filterBy: {
      type: String,
      default: null
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
    },

    mergedParams () {
      return merge({}, this.searchParams, this.sortParams)
    },

    filteredItems () {
      if (!this.filter || !this.filterBy) {
        return this.items
      }

      return this.items.filter(item => {
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
      this.sortParams = {
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
  },

  watch: {
    filteredItems (val) {
      if (val.length !== this.items.length) {
        this.$refs.infiniteload.load()
      }
    }
  }
}
</script>
