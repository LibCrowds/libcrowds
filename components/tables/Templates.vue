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

    <template slot="actions" scope="tmpl">
      <b-btn
        v-if="showDetails"
        variant="info"
        size="sm"
        @click.stop="tmpl.toggleDetails">
        {{ tmpl.detailsShowing ? 'Hide' : 'Show' }} Details
      </b-btn>
      <slot name="action" :item="tmpl.item"></slot>
    </template>

    <template slot="row-details" scope="tmpl">
      <b-card
        :bg-variant="darkMode ? 'dark' : null"
        :text-variant="darkMode ? 'white' : null">

        <h5>Project Details</h5>
        <ul class="list-unstyled">
          <li
            v-for="key in getProjectKeys(tmpl.item)"
            :class="getHighlightCls(tmpl.item, key)"
            :key="key">
            <strong>{{ key }}:</strong>
            {{ tmpl.item[key] }}
          </li>
        </ul>

        <h5 class="mt-3">Task Details</h5>
        <ul class="list-unstyled" v-if="tmpl.item.task">
          <li
            v-for="key in Object.keys(tmpl.item.task)"
            :class="getHighlightCls(tmpl.item, key, 'task')"
            :key="key">
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
        </ul>
        <p v-else>None</p>

        <h5 class="mt-3">Analysis Rules</h5>
        <ul class="list-unstyled" v-if="tmpl.item.rules">
          <li
            v-for="key in Object.keys(tmpl.item.rules)"
            :class="getHighlightCls(tmpl.item, key, 'rules')"
            :key="key">
            <strong>{{ key }}:</strong>
            {{ tmpl.item.rules[key] }}
          </li>
        </ul>
        <p v-else>None</p>
        <h5 class="mt-3">Tutorial</h5>
        <div
          v-if="tmpl.item.tutorial"
          :class="getHighlightCls(tmpl.item, 'tutorial')"
          v-html="marked(tmpl.item.tutorial)">
        </div>
        <p v-else>None</p>

      </b-card>
    </template>
  </b-table>
</template>

<script>
import isEqual from 'lodash/isEqual'
import marked from 'marked'

export default {
  props: {
    templates: {
      type: Array,
      required: true
    },
    fields: {
      type: Object,
      default: () => {
        return {
          name: {
            label: 'Name',
            sortable: true
          }
        }
      }
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
    },
    ignoreDiff: {
      type: Array,
      default: () => ([])
    }
  },

  computed: {
    mergedFields () {
      const fieldsCopy = JSON.parse(JSON.stringify(this.fields))
      if (this.showDetails || this.$scopedSlots.action) {
        fieldsCopy.actions = {
          label: 'Actions',
          class: 'text-center'
        }
      }
      return fieldsCopy
    },

    filteredItems () {
      let items = this.templates

      if (this.collectionId) {
        items = items.filter(item => {
          return item.category_id === this.collectionId
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
  },

  methods: {
    /**
     * Return core project keys.
     * @param {Object} tmpl
     *   The template.
     */
    getProjectKeys (tmpl) {
      const hiddenKeys = [
        'task',
        'rules',
        'tutorial',
        'pending',
        '_original',
        '_showDetails'
      ]
      return Object.keys(tmpl).filter(key => hiddenKeys.indexOf(key) < 0)
    },

    /**
     * Highlight text if the value has changed.
     * @param {Object} tmpl
     *   The template.
     * @param {String} key
     *   The key to check against the original.
     * @param {String} baseKey
     *   The context for checking the key.
     */
    getHighlightCls (tmpl, key, baseKey = null) {
      let changed = false
      if (
        typeof tmpl._original !== 'undefined' &
        this.ignoreDiff.indexOf(key) < 0
      ) {
        changed = baseKey
          ? !isEqual(tmpl[baseKey][key], tmpl._original[baseKey][key])
          : !isEqual(tmpl[key], tmpl._original[key])
      }
      return {
        'text-success': changed
      }
    },

    /**
     * Markdown processor.
     */
    marked
  }
}
</script>
