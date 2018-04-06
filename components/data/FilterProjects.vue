<template>
  <div class="filter-projects-data">
    <div
      v-for="(tag, index) in collection.info.tags"
      :key="index"
      class="mb-2">
      <label v-if="!hideLabel">{{ tag.name }}</label>
      <multiselect
        :id="tag.name"
        v-model="model[tag.name]"
        :placeholder="`Filter by ${tag.name.toLowerCase()}`"
        :show-labels="false"
        :options="options[tag.name] || []"
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
      model: this.value,
      options: {}
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
     * @param {String} value
     *   The tag value.
     * @param {String} name
     *   The tag name (which comes from the multiselect component ID).
     */
    onInput (value, name) {
      this.model[name] = value
      // Emit with null values removed
      this.$emit('input', pickBy(this.model, identity))
    },

    /**
     * Handle a tag being selected.
     * @param {String} value
     *   The tag name.
     * @param {String} name
     *   The tag name (which comes from the multiselect component ID).
     */
    onSelect (value, typnamee) {
      this.$emit('select', value, name)
    }
  },

  mounted () {
    // Get all current tags for the collection.
    const endpoint = `/lc/categories/${this.collection.short_name}/tags`
    return this.$axios.$get(endpoint).then(data => {
      this.options = data.tags
    }).catch(err => {
      this.$nuxt.error(err)
    })
  },

  watch: {
    value (val) {
      this.model = val
    }
  }
}
</script>
