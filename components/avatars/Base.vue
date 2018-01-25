<template>
  <div class="base-avatar">
    <img
      v-if="src && !hasError"
      :src="src"
      :class="imgClass"
      :style="imgStyle"
      v-b-tooltip
      :title="tooltip"
      :triggers="tooltipTriggers"
      @error="handleError">
    </img>
    <slot v-else name="placeholder"></slot>
  </div>
</template>

<script>
export default {
  data () {
    return {
      hasError: false
    }
  },

  props: {
    src: {
      type: String,
      required: true
    },
    altTag: {
      type: String,
      required: true
    },
    imgClass: {
      type: String,
      default: null
    },
    imgStyle: {
      type: String,
      default: null
    },
    tooltip: {
      type: String,
      default: null
    },
    tooltipTriggers: {
      type: [Boolean, String, Array],
      default: () => []
    }
  },

  methods: {
    /**
     * Handle error while loading an image.
     */
    handleError () {
      this.hasError = true
      console.warn(`Image not found: ${this.src}`)
    }
  },

  watch: {
    src () {
      this.hasError = false
    }
  }
}
</script>
