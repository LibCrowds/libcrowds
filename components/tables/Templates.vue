<template>
  <b-table
    responsive
    striped
    hover
    show-empty
    :outlined="outlined"
    :items="filteredItems"
    :fields="mergedFields">

    <template slot="actions" scope="tmpl">
      <b-btn
        v-if="showDetails"
        variant="info"
        class="m-1"
        size="sm"
        @click.stop="tmpl.toggleDetails">
        {{ tmpl.detailsShowing ? 'Hide' : 'Show' }} Details
      </b-btn>
      <slot name="action" :item="tmpl.item"></slot>
    </template>

    <template slot="row-details" scope="tmpl">
      <b-card>
        <h5>Project Details</h5>
        <ul class="list-unstyled">
          <li v-for="key in Object.keys(tmpl.item.project)" :key="key">
            <strong>{{ key }}:</strong>
            {{ tmpl.item.project[key] }}
          </li>
          <h5 class="mt-3">Task Details</h5>
          <template v-if="tmpl.item.rules">
            <li v-for="key in Object.keys(tmpl.item.task)" :key="key">
              <strong>{{ key }}:</strong>
              <template v-if="key === 'fields_schema'">
                <ul>
                  <li
                    v-for="field in tmpl.item.task[key]"
                    :key="field">
                    <strong>{{ field.model }}:</strong>
                    <ul>
                      <li
                        v-for="fieldKey in Object.keys(field)"
                        :key="fieldKey">
                        <strong>{{ fieldKey }}:</strong>
                        {{ field[fieldKey] }}
                      </li>
                    </ul>
                  </li>
                </ul>
              </template>
              <template v-else-if="key === 'institutions'">
                <ul>
                  <li
                    v-for="code in tmpl.item.task[key]"
                    :key="code">
                    {{ code }}
                  </li>
                </ul>
              </template>
              <template v-else>
                {{ tmpl.item.task[key] }}
              </template>
            </li>
          </template>
          <template v-else>
            <li>None</li>
          </template>
          <h5 class="mt-3">Analysis Details</h5>
          <template v-if="tmpl.item.rules">
            <li
              v-for="key in Object.keys(tmpl.item.rules)"
              :key="key">
              <strong>{{ key }}:</strong>
              {{ tmpl.item.rules[key] }}
            </li>
          </template>
          <template v-else>
            <li>None</li>
          </template>
        </ul>
      </b-card>
    </template>
  </b-table>
</template>

<script>
import merge from 'lodash/merge'

export default {
  data () {
    return {
      defaultFields: {
        name: {
          label: 'Name',
          sortable: true
        },
        description: {
          label: 'Description',
          sortable: true
        }
      }
    }
  },

  props: {
    templates: {
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
    },
    collectionId: {
      type: Number,
      default: null
    }
  },

  computed: {
    mergedFields () {
      const fields = merge({}, this.defaultFields, this.extraFields)
      if (this.showDetails || this.$scopedSlots.action) {
        fields.actions = {
          label: 'Actions',
          class: 'text-center'
        }
      }
      return fields
    },

    filteredItems () {
      let items = this.templates.map(tmpl => {
        tmpl.name = tmpl.project.name
        tmpl.description = tmpl.project.description
        return tmpl
      })

      if (this.collectionId) {
        items = items.filter(item => {
          return item.project.category_id === this.collectionId
        })
      }

      if (!this.filter || !this.filterBy) {
        return items
      }

      return items.filter(item => {
        const value = this.filter.toUpperCase()
        const cell = item[this.filterBy]
        return JSON.stringify(cell).toUpperCase().indexOf(value) > -1
      })
    }
  }
}
</script>
