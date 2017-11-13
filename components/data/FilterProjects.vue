<template>
  <div class="filter-projects-data">
    <div
      v-for="(tag, key) in collection.info.tags"
      :key="key"
      class="mb-2">
      <label v-if="!hideLabel">{{ key }}</label>
      <multiselect
        :id="key"
        v-model="model[key]"
        :placeholder="`Filter by ${key.toLowerCase()}`"
        :show-labels="false"
        :options="tag.options"
        @input="onInput"
        @select="onSelect">
      </multiselect>
    </div>
  </div>
</template>

<script>
import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'

export default {
  data () {
    return {
      model: this.value
    }
  },

  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    collection: {
      type: Object,
      required: true
    },
    hideLabel: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    /**
     * Handle a tag being selected or removed.
     * @param {String} name
     *   The tag name.
     * @param {String} type
     *   The tag type (which comes from the multiselect component ID).
     */
    onInput (name, type) {
      this.model[type] = name
      // Emit with null values removed
      this.$emit('input', pickBy(this.model, identity))
    },

    /**
     * Handle a tag being selected.
     * @param {String} name
     *   The tag name.
     * @param {String} type
     *   The tag type (which comes from the multiselect component ID).
     */
    onSelect (name, type) {
      this.$emit('select', name, type)
    }
  },

  watch: {
    value (val) {
      this.model = val
    }
  }
}
</script>
