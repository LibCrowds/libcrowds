<template>
  <div class="project-tags-list">
    <b-badge
      v-for="(value, name) in tags"
      :key="name"
      :style="getTagStyle(name)"
      @click.prevent="handleClick(name, value)">
      {{ name }}: {{ value }}
    </b-badge>
  </div>
</template>

<script>
export default {
  props: {
    tags: {
      type: Object,
      required: true
    },
    collection: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    /**
     * Return the colour of a tag.
     * @param {String} name
     *   The tag name.
     */
    getTagStyle (name) {
      const tag = this.collection.info.tags.filter(t => {
        return t.name === name
      })[0] || null

      let color = this.darkMode || !tag || !tag.color
        ? '#868e96'
        : tag.color

      return {
        backgroundColor: color,
        cursor: this.disabled ? 'default' : 'pointer'
      }
    },

    /**
     * Handle click.
     * @param {String} name
     *   The tag name.
     * @param {String} value
     *   The tag value.
     */
    handleClick (name, value) {
      if (!this.disabled) {
        this.$emit('tag-click', name, value)
      }
    }
  }
}
</script>

<style lang="scss">
.project-tags-list {
  .badge {
    letter-spacing: 0.2px;
    font-weight: 400;
    margin-left: 0.25rem;
    margin-right: 0.25rem;

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>