<template>
  <div>
    <label v-if="!hideLabel">Sort by</label>
    <multiselect
      label="name"
      track-by="name"
      v-model="model"
      placeholder="Sort projects by"
      :show-labels="false"
      :show-no-results="false"
      :options="sortOptions"
      @input="onInput"
      @select="onSelect">
    </multiselect>
  </div>
</template>

<script>
export default {
  data () {
    return {
      sortOptions: [
        {
          name: 'Most Tasks',
          orderby: 'n_tasks',
          desc: true
        },
        {
          name: 'Least Tasks',
          orderby: 'n_tasks',
          desc: false
        },
        {
          name: 'Most Popular',
          orderby: 'n_volunteers',
          desc: true
        },
        {
          name: 'Least Popular',
          orderby: 'n_volunteers',
          desc: false
        },
        {
          name: 'Most Complete',
          orderby: 'overall_progress',
          desc: true
        },
        {
          name: 'Least Complete',
          orderby: 'overall_progress',
          desc: false
        }
      ],
      model: this.value
    }
  },

  props: {
    value: {
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
     * Handle sorting change.
     * @param {String} value
     *   The sorting option.
     */
    onInput (value) {
      if (value) {
        this.$emit('input', value)
      }
    },

    /**
     * Handle an option being selected.
     * @param {String} value
     *   The sorting option.
     */
    onSelect (value) {
      this.$emit('select', value)
    }
  },

  watch: {
    value (val, oldVal) {
      this.model = val
    }
  }
}
</script>