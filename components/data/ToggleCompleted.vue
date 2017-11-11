<template>
  <div class="d-flex align-items-center justify-content-between">
    <label class="mr-1 mb-0 toggle-label">
      Show Completed
    </label>
    <toggle-button
      :value="value"
      :sync="true"
      :labels="true"
      class="mb-0"
      @change="onChange">
    </toggle-button>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    /**
     * Handle the toggle change.
     */
    onChange (change) {
      this.$emit('input', change.value)
    }
  },

  beforeMount () {
    this.$emit('input', false)
  }
}
</script>
