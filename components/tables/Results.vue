<template>
  <div class="infinite-loading-table">
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


      <template slot="created" scope="result">
        {{ result.item.created | moment('calendar') }}
      </template>

      <template slot="isempty" scope="result">
        {{ isResultEmpty(result.item) }}
      </template>

      <template slot="task_run_ids" scope="result">
        {{ result.item.task_run_ids.length }}
      </template>

      <template slot="actions" scope="result">
        <slot name="action" :item="result.item"></slot>
      </template>

      <template slot="row-details" scope="result">
        <b-card
          :bg-variant="darkMode ? 'dark' : 'light'"
          :text-variant="darkMode ? 'white' : null">
          <pre class=".pre-scrollable mb-0">
            <code>
<!-- No indentation to force correct indentation in code block -->
{{ JSON.stringify(result.item, null, 2) }}
            </code>
          </pre>
        </b-card>
      </template>

    </b-table>

    <infinite-load
      domain-object="result"
      v-model="items"
      :search-params="mergedParams"
      no-more-results="No more results">
    </infinite-load>

  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import InfiniteLoad from '@/components/InfiniteLoad'

export default {
  data () {
    return {
      items: [],
      sortParams: {},
      defaultFields: {
        id: {
          label: 'ID'
        },
        created: {
          label: 'created',
          class: 'text-center d-none d-md-table-cell',
          sortable: true
        },
        isempty: {
          label: 'Empty',
          class: 'text-center d-none d-xl-table-cell'
        },
        task_run_ids: {
          label: 'Answers',
          class: 'text-center d-none d-xl-table-cell'
        }
      },
      searchParams: {
        project_id: this.project.id
      }
    }
  },

  components: {
    InfiniteLoad
  },

  props: {
    project: {
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
    }
  },

  computed: {
    mergedParams () {
      const mergedParams = Object.assign({}, this.searchParams)
      return Object.assign(mergedParams, this.sortParams)
    },

    mergedFields () {
      let fieldsCopy = Object.assign({}, this.defaultFields)
      fieldsCopy = Object.assign(fieldsCopy, this.fields)
      if (this.$scopedSlots.action) {
        fieldsCopy.actions = {
          label: 'Actions',
          class: 'text-center'
        }
      }
      return fieldsCopy
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
     * @param {Object} value
     *   The sort value.
     */
    onSortChange (value) {
      this.sortParams = {
        orderby: value.sortBy,
        desc: value.sortDesc
      }
    },

    /**
     * Check if a result is empty.
     * @param {Object} result
     *   The result.
     */
    isResultEmpty (result) {
      return isEmpty(result.info)
    }
  }
}
</script>
