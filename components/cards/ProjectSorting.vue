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