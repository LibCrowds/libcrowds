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

    <div class="mb-2">
      <label>Sort by</label>
      <multiselect
        label="name"
        track-by="name"
        placeholder="Sort projects by"
        :show-labels="false"
        :options="sortOptions"
        @input="onSortChange">
      </multiselect>
    </div>

  </b-card>
</template>

<script>
import merge from 'lodash/merge'
import { computeTags } from '@/mixins/computeTags'

export default {
  mixins: [ computeTags ],

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
      sortParams: {},
      tagParams: {}
    }
  },

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
      if (tag) {
        if (params.info.length) {
          params.info += '|'
        }
        params.info += `${key}::${tag.name}`
      } else if (!params.info.length) {
        delete params.info
      }
      this.tagParams = params
      this.update()
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
    },

    /**
     * Handle sort change.
     */
    onSortChange (value) {
      if (!value) {
        this.sortParams = {}
      } else {
        delete value.name
        this.sortParams = value
      }
      this.update()
    },

    /**
     * Emit the new params.
     */
    update () {
      const searchParams = merge(this.tagParams, this.sortParams)
      this.$emit('input', searchParams)
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