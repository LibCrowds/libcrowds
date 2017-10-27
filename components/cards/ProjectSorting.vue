<template>
  <b-card
    id="project-sorting-options"
    header="Sorting Options">

    <div
      v-for="tag in tags"
      :key="tag.type"
      class="mb-2">
      <label>{{ tag.type }}</label>
      <multiselect
        label="name"
        :placeholder="`Filter by ${tag.type.toLowerCase()}`"
        :show-labels="false"
        :multiple="true"
        :options="tag.options">
      </multiselect>
    </div>

    <div class="d-flex align-items-center">
      <label class="mr-1 mb-0 toggle-label">
        <strong>Show completed:</strong>
      </label>
      <toggle-button
        :value="value.completed"
        :sync="true"
        :labels="true"
        class="mb-0"
        @change="toggleCompleted">
      </toggle-button>
    </div>

  </b-card>
</template>

<script>
import { tags } from '@/mixins/tags'

export default {
  mixins: [ tags ],

  props: {
    value: {
      type: Object,
      required: true
    }
  },

  methods: {
    /**
     * Toggle completed in the search params.
     */
    toggleCompleted () {
      const params = JSON.parse(JSON.stringify(this.value))
      params.completed = !params.completed
      this.$emit('input', params)
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