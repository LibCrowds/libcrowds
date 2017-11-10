<template>
  <div class="project-tags-list">
    <b-badge
      v-for="(value, type) in project.info.tags"
      :key="type"
      class="mr-1"
      href="#"
      :style="getTagStyle(type)"
      @click.prevent="$emit('tag-click', type, value)">
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
          : '#666'
      }
    }
  }
}
</script>

<style lang="scss">
#project-tags-list {
  letter-spacing: 0.2px;
  font-weight: 400;

  .badge {
    margin-left: 0.25rem;
  }

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }
}
</style>