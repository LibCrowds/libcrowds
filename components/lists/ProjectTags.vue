<template>
  <div class="project-tags-list">
    <b-badge
      v-for="(value, type) in project.info.tags"
      :key="type"
      :style="getTagStyle(type)"
      @click.prevent="handleClick(type, value)">
      {{ type }}: {{ value }}
    </b-badge>
  </div>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
      required: true
    },
    collection: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    /**
     * Return the colour of the tag, if it still exists.
     * @param {String} type
     *   The tag type
     */
    getTagStyle (type) {
      const collectionTag = this.collection.info.tags[type]
      return {
        backgroundColor: typeof collectionTag !== 'undefined'
          ? collectionTag.color
          : '#909090',
        cursor: this.disabled ? 'default' : 'pointer'
      }
    },

    /**
     * Handle click.
     * @param {String} type
     *   The tag type.
     * @param {String} name
     *   The tag name.
     */
    handleClick (type, name) {
      if (!this.disabled) {
        this.$emit('tag-click', type, name)
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