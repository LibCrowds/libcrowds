<template>
  <div class="infinite-loading-table">
    <b-table
      hover
      striped
      show-empty
      :outlined="outlined"
      :dark="darkMode"
      :items="items"
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
      :search-keys="searchKeys"
      :search-string="searchString"
      no-more-results="No more results">
    </infinite-load-domain-objects>

  </div>
</template>

<script>
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
