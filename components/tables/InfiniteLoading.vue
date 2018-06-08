<template>
  <div class="infinite-loading-table">
    <b-table
      hover
      striped
      show-empty
      :outlined="outlined"
      :dark="darkMode"
      :items="filteredItems"
      :fields="tableFields"
      @sort-changed="onSortChange">

      <template slot="created" slot-scope="data">
        {{ data.item.created | moment('calendar') }}
      </template>

      <template slot="updated" slot-scope="data">
        {{ data.item.updated | moment('calendar') }}
      </template>

      <template slot="last_activity" slot-scope="data">
        {{ data.item.updated | moment('calendar') }}
      </template>

      <template slot="actions" slot-scope="data">
        <slot name="action" :item="data.item"></slot>
      </template>

    </b-table>

    <infinite-load-domain-objects
      ref="infiniteload"
      :domain-object="domainObject"
      v-model="items"
      :search-params="mergedParams"
      no-more-results="No more results">
    </infinite-load-domain-objects>

  </div>
</template>

<script>
import Fuse from 'fuse.js'
import InfiniteLoadDomainObjects from '@/components/infiniteload/DomainObjects'

export default {
  data () {
    return {
      items: [],
      sortParams: {}
    }
  },

  components: {
    InfiniteLoadDomainObjects
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
    searchString: {
      type: String,
      default: ''
    },
    searchKeys: {
      type: Array,
      default: () => ([])
    },
    fields: {
      type: Object,
      default: () => ({})
    },
    outlined: {
      type: Boolean,
      default: false
    }
  },

  computed: {
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
      const params = JSON.parse(JSON.stringify(this.searchParams))
      return Object.assign({}, params, this.sortParams)
    },

    // http://fusejs.io/
    fuse () {
      return new Fuse(this.items, {
        shouldSort: true,
        tokenize: true,
        matchAllTokens: true,
        findAllMatches: true,
        threshold: 0,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: this.searchKeys
      })
    },

    filteredItems () {
      if (
        this.searchKeys &&
        this.searchString &&
        this.searchKeys.length &&
        this.searchString.length
      ) {
        return this.fuse.search(this.searchString)
      }
      return this.items
    }
  },

  methods: {
    /**
     * Handle table sort change.
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
  }
}
</script>
