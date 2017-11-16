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
import isEmpty from 'lodash/isEmpty'

export default {
  props: {
    project: {
      type: Object,
      required: true
    },
    collection: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    enabled () {
      return !isEmpty(this.collection)
    }
  },

  methods: {
    /**
     * Return the colour of the tag, if it still exists.
     * @param {String} type
     *   The tag type
     */
    getTagStyle (type) {
      let color = '#909090'
      if (!isEmpty(this.collection) && this.collection.info.tags[type]) {
        color = this.collection.info.tags[type].color
      }
      return {
        backgroundColor: color,
        cursor: this.enabled ? 'pointer' : 'default'
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
      if (this.enabled) {
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