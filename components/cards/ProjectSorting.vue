<template>
  <b-card
    id="project-sorting-options"
    header="Sorting Options">

    <div
      v-for="(tag, index) in tags"
      :key="index"
      class="mb-2">
      <label>{{ tag.type }}</label>
      <multiselect
        label="name"
        track-by="name"
        :id="tag.key"
        :placeholder="`Filter by ${tag.type.toLowerCase()}`"
        :show-labels="false"
        :options="tag.options"
        @input="onTagChange">
      </multiselect>
    </div>

  </b-card>
</template>

<script>
import { computeTags } from '@/mixins/computeTags'

export default {
  mixins: [ computeTags ],

  props: {
    value: {
      type: Object,
      required: true
    }
  },

  methods: {
    /**
     * Handle a tag being selected or removed.
     * @param {Object} tag
     *   The tag.
     * @param {Object} key
     *   The component ID (which should be the tag key).
     */
    onTagChange (tag, key) {
      const params = JSON.parse(JSON.stringify(this.value))
      params.info = params.info || ''

      params.info = this.stripTag(params.info, key)
      if (params.info.length) {
        params.info += '|'
      }
      params.info += `${key}::${tag.name}`
      this.$emit('input', params)
    },

    /**
     * Strip a tag.
     * @param {Object} info
     *   The info data (where tags are stored).
     * @param {String} tagKey
     *   The tag key to be stripped.
     */
    stripTag (info, tagKey) {
      const infoParams = info.split('|')
      const stripped = infoParams.filter(param => {
        return param.split('::')[0] !== tagKey
      })
      return stripped.join('|')
    }
  }
}
</script>

<style lang="scss">
@import '~assets/style/settings';

#project-sorting-options {
  font-size: $font-size-sm;
  margin-top: 0;

  .card-header {
    background-color: $gray-100;
    text-align: center;
    padding: $list-group-item-padding-y $list-group-item-padding-x;
  }

  #show-completed {
    label {
      margin: 0 5px 0 0;
    }
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>