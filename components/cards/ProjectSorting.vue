<template>
  <b-card
    id="project-sorting-options"
    header="Sorting Options">

    <div
      v-for="multiselect in multiselects"
      :key="multiselect.type"
      class="mb-2">
      <label>{{ multiselect.type }}</label>
      <multiselect
        label="name"
        :placeholder="`Filter by ${multiselect.type.toLowerCase()}`"
        :show-labels="false"
        :multiple="true"
        :options="multiselect.options">
      </multiselect>
    </div>

    <!-- <div id="show-completed" class="form-group mb-0 mt-2">
      <label>Show completed:</label>
      <toggle-button
        :value="showCompleted"
        :sync="true"
        :labels="true"
        @change="onToggleCompleted">
      </toggle-button>
    </div> -->

  </b-card>
</template>

<script>
export default {
  props: {
    collection: {
      type: Object,
      required: true
    }
  },

  computed: {
    multiselects () {
      const multiselects = []
      const tags = this.collection.info.tags
      const uniqueTypes = [...new Set(tags.map(tag => tag.type))]
      for (let type of uniqueTypes) {
        multiselects.push({
          type: type,
          options: tags.filter(tag => {
            return tag.type === type
          })
        })
      }
      console.log(multiselects)
      return multiselects
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