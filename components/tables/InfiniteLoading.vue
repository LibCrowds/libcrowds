<template>
  <div class="infinite-loading-table">
    <b-table
      hover
      striped
      show-empty
      :items="items"
      :fields="tableFields"
      :style="cardStyle"
      @sort-changed="reset">

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

    <infinite-load
      ref="infiniteload"
      :domain-object="domainObject"
      v-model="items"
      no-more-results="No more results">
    </infinite-load>

  </div>
</template>

<script>
import InfiniteLoad from '@/components/InfiniteLoad'

export default {
  data () {
    return {
      items: []
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
    fields: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    cardStyle () {
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
    reset () {
      this.$refs.infiniteload.reset()
    }
  }
}
</script>
